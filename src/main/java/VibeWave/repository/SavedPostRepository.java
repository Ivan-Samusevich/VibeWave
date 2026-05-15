package VibeWave.repository;

import VibeWave.entity.SavedPost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SavedPostRepository extends JpaRepository<SavedPost, Long> {
    void deleteByUserIdAndPostId(Long userId, Long postId);

    List<SavedPost> findAllByUserId(Long userId);

    boolean existsByUserIdAndPostId(Long userId, Long postId);
}
