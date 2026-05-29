package VibeWave.repository;

import VibeWave.entity.Post;
import VibeWave.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    Post findByPostId(Long postId);

    @Modifying
    @Query("UPDATE Post p SET p.likesCount = p.likesCount + 1 WHERE p.id = :postId")
    void incrementLikesCount(@Param("postId") Long postId);

    @Modifying
    @Query("UPDATE Post p SET p.likesCount = p.likesCount - 1 WHERE p.id = :postId")
    void decrementLikesCount(@Param("postId") Long postId);

    List<Post> findAllByUser(User user);

    @Query("""
            SELECT p FROM Post p
            JOIN FETCH p.user u
            LEFT JOIN FETCH u.userProfile
            """)
    List<Post> findAllPosts();
}
