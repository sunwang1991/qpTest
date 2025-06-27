import { TransactionService } from '../src/modules/mini/service/transaction';
import { TransactionRepository } from '../src/modules/mini/repository/transaction';
import { RoomRepository } from '../src/modules/mini/repository/room';

// Mock the dependencies
jest.mock('../src/modules/mini/repository/transaction');
jest.mock('../src/modules/mini/repository/room');

describe('Transaction Service Unit Tests', () => {
  let transactionService: TransactionService;
  let mockTransactionRepository: jest.Mocked<TransactionRepository>;
  let mockRoomRepository: jest.Mocked<RoomRepository>;

  beforeEach(() => {
    // Create mock instances
    mockTransactionRepository =
      new TransactionRepository() as jest.Mocked<TransactionRepository>;
    mockRoomRepository = new RoomRepository() as jest.Mocked<RoomRepository>;

    // Create service instance with mocked dependencies
    transactionService = new TransactionService();
    (transactionService as any).transactionRepository =
      mockTransactionRepository;
    (transactionService as any).roomRepository = mockRoomRepository;
  });

  describe('payToUser', () => {
    it('should throw error when paying to self', async () => {
      // Mock room exists
      mockRoomRepository.findRoomById.mockResolvedValue({
        id: 1,
        statusFlag: '1',
      } as any);

      await expect(transactionService.payToUser(1, 1, 1, 100)).rejects.toThrow(
        '不能向自己支付'
      );
    });

    it('should throw error when amount is zero or negative', async () => {
      // Mock room exists
      mockRoomRepository.findRoomById.mockResolvedValue({
        id: 1,
        statusFlag: '1',
      } as any);

      await expect(transactionService.payToUser(1, 1, 2, 0)).rejects.toThrow(
        '支付金额必须大于0'
      );

      await expect(transactionService.payToUser(1, 1, 2, -100)).rejects.toThrow(
        '支付金额必须大于0'
      );
    });

    it('should throw error when room does not exist', async () => {
      mockRoomRepository.findRoomById.mockResolvedValue(null);

      await expect(transactionService.payToUser(1, 1, 2, 100)).rejects.toThrow(
        '房间不存在或已结束'
      );
    });

    it('should throw error when room is not active', async () => {
      mockRoomRepository.findRoomById.mockResolvedValue({
        id: 1,
        statusFlag: '0', // inactive
      } as any);

      await expect(transactionService.payToUser(1, 1, 2, 100)).rejects.toThrow(
        '房间不存在或已结束'
      );
    });

    it('should throw error when user not in room', async () => {
      // Mock room exists
      mockRoomRepository.findRoomById.mockResolvedValue({
        id: 1,
        statusFlag: '1',
      } as any);

      // Mock room users (only user 2 and 3 in room)
      mockRoomRepository.selectUsersByRoomId.mockResolvedValue([
        { id: 2 },
        { id: 3 },
      ] as any);

      await expect(
        transactionService.payToUser(1, 1, 2, 100) // user 1 not in room
      ).rejects.toThrow('支付用户不在房间内');

      await expect(
        transactionService.payToUser(1, 2, 4, 100) // user 4 not in room
      ).rejects.toThrow('收款用户不在房间内');
    });

    it('should successfully create transaction when all validations pass', async () => {
      // Mock room exists
      mockRoomRepository.findRoomById.mockResolvedValue({
        id: 1,
        statusFlag: '1',
      } as any);

      // Mock room users
      mockRoomRepository.selectUsersByRoomId.mockResolvedValue([
        { id: 1 },
        { id: 2 },
      ] as any);

      // Mock successful transaction creation
      mockTransactionRepository.insertTransaction.mockResolvedValue({
        raw: { affectedRows: 1 },
      } as any);

      const result = await transactionService.payToUser(1, 1, 2, 100);

      expect(result).toBe(true);
      expect(mockTransactionRepository.insertTransaction).toHaveBeenCalledWith({
        roomId: 1,
        userId: 1,
        receiveUserId: 2,
        payMoney: 100,
      });
    });
  });

  describe('getRoomUserStats', () => {
    it('should throw error when room does not exist', async () => {
      mockRoomRepository.findRoomById.mockResolvedValue(null);

      await expect(transactionService.getRoomUserStats(1)).rejects.toThrow(
        '房间不存在'
      );
    });

    it('should return user stats with transaction data', async () => {
      // Mock room exists
      mockRoomRepository.findRoomById.mockResolvedValue({
        id: 1,
        statusFlag: '1',
      } as any);

      // Mock room users
      mockRoomRepository.selectUsersByRoomId.mockResolvedValue([
        { id: 1, nickName: 'User1', avatar: 'avatar1.jpg' },
        { id: 2, nickName: 'User2', avatar: 'avatar2.jpg' },
      ] as any);

      // Mock transaction stats
      mockTransactionRepository.getRoomUserTransactionStats.mockResolvedValue([
        { userId: 1, totalPay: 100, totalReceive: 50, netAmount: -50 },
        { userId: 2, totalPay: 50, totalReceive: 100, netAmount: 50 },
      ]);

      const result = await transactionService.getRoomUserStats(1);

      expect(result).toEqual([
        {
          userId: 1,
          nickName: 'User1',
          avatar: 'avatar1.jpg',
          totalPay: 100,
          totalReceive: 50,
          netAmount: -50,
        },
        {
          userId: 2,
          nickName: 'User2',
          avatar: 'avatar2.jpg',
          totalPay: 50,
          totalReceive: 100,
          netAmount: 50,
        },
      ]);
    });

    it('should return zero stats for users with no transactions', async () => {
      // Mock room exists
      mockRoomRepository.findRoomById.mockResolvedValue({
        id: 1,
        statusFlag: '1',
      } as any);

      // Mock room users
      mockRoomRepository.selectUsersByRoomId.mockResolvedValue([
        { id: 1, nickName: 'User1', avatar: 'avatar1.jpg' },
      ] as any);

      // Mock empty transaction stats
      mockTransactionRepository.getRoomUserTransactionStats.mockResolvedValue(
        []
      );

      const result = await transactionService.getRoomUserStats(1);

      expect(result).toEqual([
        {
          userId: 1,
          nickName: 'User1',
          avatar: 'avatar1.jpg',
          totalPay: 0,
          totalReceive: 0,
          netAmount: 0,
        },
      ]);
    });
  });
});
