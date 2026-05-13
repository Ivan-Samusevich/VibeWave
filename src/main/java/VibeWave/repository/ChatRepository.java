package VibeWave.repository;

import VibeWave.entity.Chat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChatRepository extends JpaRepository<Chat, Long> {

    Optional<Chat> findByFirstUserIdAndSecondUserId(Long firstUserId, Long secondUserId);

    List<Chat> findByFirstUserIdOrSecondUserId(Long firstUserId, Long secondUserId);
}
