package VibeWave.repository;

import VibeWave.entity.Like;
import VibeWave.entity.Post;
import VibeWave.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Set;

public interface LikeRepository extends JpaRepository<Like, Long> {

    boolean existsByUserAndPost(User user, Post post);

    @Query("""
            SELECT l.post.postId
            FROM Like l
            WHERE l.user.userId = :userId
            """)
    Set<Long> findLikedPostIds(@Param("userId") Long userId);

    @Modifying
    @Query("DELETE FROM Like l WHERE l.user.userId = :userId AND l.post.postId = :postId")
    void deleteByUserIdAndPostId(@Param("userId") Long userId, @Param("postId") Long postId);
}
