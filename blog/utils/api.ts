// utils/api.ts

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

interface RequestConfig extends RequestInit {
  params?: Record<string, string | number>;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export const api = {
  /**
   * 发送请求的基础方法
   * @param endpoint API端点
   * @param config 请求配置
   */
  async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    try {
      // 处理查询参数
      if (config.params) {
        const queryParams = new URLSearchParams();
        Object.entries(config.params).forEach(([key, value]) => {
          queryParams.append(key, String(value));
        });
        endpoint = `${endpoint}?${queryParams.toString()}`;
      }

      // 设置默认headers
      const headers = {
        "Content-Type": "application/json",
        ...config.headers,
      };

      const response = await fetch(endpoint, {
        ...config,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(response.status, data.message || "请求失败");
      }

      return {
        data,
        status: response.status,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, error.message || "网络请求失败");
    }
  },

  /**
   * GET请求
   * @param endpoint API端点
   * @param config 请求配置
   */
  async get<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: "GET",
    });
  },

  /**
   * POST请求
   * @param endpoint API端点
   * @param data 请求数据
   * @param config 请求配置
   */
  async post<T>(
    endpoint: string,
    data?: any,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * PUT请求
   * @param endpoint API端点
   * @param data 请求数据
   * @param config 请求配置
   */
  async put<T>(
    endpoint: string,
    data?: any,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  /**
   * DELETE请求
   * @param endpoint API端点
   * @param config 请求配置
   */
  async delete<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: "DELETE",
    });
  },
};

// 用户信息相关的API封装
export const userInfoApi = {
  // 获取用户信息
  async getUserInfo() {
    return api.get("/api/user-info");
  },

  // 保存用户信息
  async saveUserInfo(data: any) {
    return api.post("/api/user-info", data);
  },

  // 更新用户信息
  async updateUserInfo(data: any) {
    return api.put("/api/user-info", data);
  },
};
