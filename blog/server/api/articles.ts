import { defineEventHandler, readBody } from "h3";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  switch (method) {
    case "GET":
      return await prisma.article.findMany(); // 获取所有文章

    case "POST":
      const body = await readBody(event);
      return await prisma.article.create({
        data: {
          title: body.title,
          content: body.content,
        },
      }); // 创建新文章

    case "PUT":
      const updateBody = await readBody(event);
      return await prisma.article.update({
        where: { id: updateBody.id },
        data: {
          title: updateBody.title,
          content: updateBody.content,
        },
      }); // 更新文章

    case "DELETE":
      const deleteBody = await readBody(event);
      return await prisma.article.delete({
        where: { id: deleteBody.id },
      }); // 删除文章

    default:
      return { message: "Method not allowed" };
  }
});
