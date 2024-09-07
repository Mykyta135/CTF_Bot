import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const teamInfo = async (teamId: string) => {
  let teamMembersString = "";

  try {
    const team = await prisma.team.findUnique({
      where: {
        tid: teamId,
      },
      include: {
        members: true,
      },
    });
    const teamMemers = await prisma.user.findMany({
      where: {
        teamCode: teamId,
      },
    });

    teamMembersString += "Команда: " + team!.name + "\n\n" + "Учасники:\n";

    teamMemers.forEach((user) => {
      teamMembersString += user.name + "\n\n";
    });
    // teamMembersString += team?.isTestSent ? 'Тест відправлено' : 'Тест не відправлено';
    return teamMembersString;
  } catch (err) {
    console.error("An error occurred:", err);
    return "Помилка при отриманні інформації про команду";
  }
};
