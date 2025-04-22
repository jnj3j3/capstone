import { db } from "../../models";

export const updateTicketRanking = async () => {
  const [results] = await db.sequelize.query(`
    SELECT 
      ts.ticketId, 
      COUNT(CASE WHEN ts.state = 'reserved' THEN 1 END) AS count,
      COUNT(*) AS total
    FROM TicketSeats ts
    GROUP BY ts.ticketId
    ORDER BY count DESC
  `);

  const values = results.map((item: any, index: number) => ({
    ticketId: item.ticketId,
    count: item.count,
    total: item.total,
    rank: index + 1,
    updated: new Date(),
  }));

  await db.TicketRanking.bulkCreate(values, {
    updateOnDuplicate: ["count", "total", "rank", "updated"],
  });
};
