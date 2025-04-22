import cron from "node-cron";
import { updateTicketRanking } from "../controllers/ticketRanking/ticketRankingFunction";

export const startRankingCronJob = () => {
  // 매일 자정에 티켓 랭킹 업데이트
  cron.schedule("0 0 * * *", async () => {
    try {
      await updateTicketRanking();
      console.log("Ticket ranking updated successfully");
    } catch (error) {
      console.error("Error updating ticket ranking:", error);
    }
  });
};
export const stopRankingCronJob = () => {
  // Stop the cron job
  cron.stop();
  console.log("Ticket ranking cron job stopped");
};
