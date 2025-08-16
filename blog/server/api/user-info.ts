import { defineEventHandler, readBody } from "h3";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  switch (method) {
    case "GET":
      try {
        // 获取第一条用户信息记录
        const userInfo = await prisma.info.findFirst();
        return userInfo;
      } catch (error) {
        console.error("获取用户信息失败:", error);
        throw createError({
          statusCode: 500,
          message: "获取用户信息失败",
        });
      }

    case "POST":
      try {
        const body = await readBody(event);

        // 如果存在记录则更新，否则创建新记录
        const userInfo = await prisma.info.upsert({
          where: {
            id: 1, // 假设只有一个用户信息记录
          },
          update: {
            name: body.name,
            age: parseInt(body.age),
            sex: body.sex,
            phone: body.phone,
            email: body.email,
            seniority: body.seniority,
            wechatNumber: body.wechatNumber,
          },
          create: {
            name: body.name,
            age: parseInt(body.age),
            sex: body.sex,
            phone: body.phone,
            email: body.email,
            seniority: body.seniority,
            wechatNumber: body.wechatNumber,
          },
        });

        return userInfo;
      } catch (error) {
        console.error("保存用户信息失败:", error);
        throw createError({
          statusCode: 500,
          message: "保存用户信息失败",
        });
      }

    default:
      throw createError({
        statusCode: 405,
        message: "Method not allowed",
      });
  }
});
