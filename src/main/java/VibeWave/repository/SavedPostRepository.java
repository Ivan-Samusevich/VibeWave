package VibeWave.repository;

import VibeWave.entity.SavedPost;
import VibeWave.entity.User;
import jakarta.persistence.ManyToOne;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Set;

public interface SavedPostRepository extends JpaRepository<SavedPost, Long> {

    @Modifying
    @Query("DELETE FROM SavedPost sp WHERE sp.user.userId = :userId AND sp.post.postId = :postId")
    void deleteByUserIdAndPostId(@Param("userId") Long userId, @Param("postId") Long postId);

    @Query("""
            SELECT sp FROM SavedPost sp
            JOIN FETCH sp.user u
            WHERE sp.user = :user
            """)
    List<SavedPost> findAllSavedPostsByUser(@Param("user") User user);

    @Query("""
            SELECT sp.post.postId
            FROM SavedPost sp
            WHERE sp.user.userId = :userId
            """)
    Set<Long> findSavedPostIds(@Param("userId") Long userId);
}
