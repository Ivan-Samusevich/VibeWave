package VibeWave.repository;

import VibeWave.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    //List<Message> findBySenderIdAndReceiverId(Long senderId, Long receiverId);

    @Query("""
        SELECT m FROM Message m
        WHERE (m.senderId = :myId AND m.receiverId = :userId)
        OR (m.senderId = :userId AND m.receiverId = :myId)
    """)
    List<Message> findChatMessages(Long myId, Long userId);
}
