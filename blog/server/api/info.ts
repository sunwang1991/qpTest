import { defineEventHandler, readBody } from "h3";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  switch (method) {
    case "GET":
      return await prisma.info.findMany(); // 获取所有信息

    case "POST":
      const body = await readBody(event);
      return await prisma.info.create({
        data: {
          name: body.name,
          age: body.age,
          sex: body.sex,
          phone: body.phone,
          email: body.email,
          seniority: body.seniority,
          wechatNumber: body.wechatNumber,
        },
      }); // 创建新信息

    case "PUT":
      const updateBody = await readBody(event);
      return await prisma.info.update({
        where: { id: updateBody.id },
        data: {
          name: body.name,
          age: body.age,
          sex: body.sex,
          phone: body.phone,
          email: body.email,
          seniority: body.seniority,
          wechatNumber: body.wechatNumber,
        },
      }); // 更新信息

    case "DELETE":
      const deleteBody = await readBody(event);
      return await prisma.article.delete({
        where: { id: deleteBody.id },
      }); // 删除

    default:
      return { message: "Method not allowed" };
  }
});
