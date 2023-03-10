/*
  Warnings:

  - You are about to drop the column `chatRoomId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `conversationId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_chatRoomId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_conversationId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "chatRoomId",
DROP COLUMN "conversationId",
ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "avatar" DROP NOT NULL;

-- CreateTable
CREATE TABLE "_conversationParticipants" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_chatRoomParticipants" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_conversationParticipants_AB_unique" ON "_conversationParticipants"("A", "B");

-- CreateIndex
CREATE INDEX "_conversationParticipants_B_index" ON "_conversationParticipants"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_chatRoomParticipants_AB_unique" ON "_chatRoomParticipants"("A", "B");

-- CreateIndex
CREATE INDEX "_chatRoomParticipants_B_index" ON "_chatRoomParticipants"("B");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_conversationParticipants" ADD CONSTRAINT "_conversationParticipants_A_fkey" FOREIGN KEY ("A") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_conversationParticipants" ADD CONSTRAINT "_conversationParticipants_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_chatRoomParticipants" ADD CONSTRAINT "_chatRoomParticipants_A_fkey" FOREIGN KEY ("A") REFERENCES "ChatRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_chatRoomParticipants" ADD CONSTRAINT "_chatRoomParticipants_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
