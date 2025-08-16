import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const method = getMethod(event);

  // 获取所有项目
  if (method === "GET") {
    try {
      const projects = await prisma.project.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });
      return {
        code: 200,
        data: projects.map((project) => ({
          ...project,
          technologies: JSON.parse(project.technologies),
        })),
      };
    } catch (error) {
      return { code: 500, message: "获取项目列表失败" };
    }
  }

  // 创建项目
  if (method === "POST") {
    try {
      const body = await readBody(event);
      const project = await prisma.project.create({
        data: {
          title: body.title,
          description: body.description,
          technologies: JSON.stringify(body.technologies),
          duration: body.duration,
          link: body.link,
          image: body.image,
        },
      });
      return { code: 200, data: project };
    } catch (error) {
      return { code: 500, message: "创建项目失败" };
    }
  }

  // 删除项目
  if (method === "DELETE") {
    try {
      const query = getQuery(event);
      const id = String(query.id);
      await prisma.project.delete({
        where: { id },
      });
      return { code: 200, message: "删除成功" };
    } catch (error) {
      return { code: 500, message: "删除项目失败" };
    }
  }
});
