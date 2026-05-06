package VibeWave.repository;

import VibeWave.entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {

    @Modifying
    @Query("UPDATE UserProfile u SET u.postCount = u.postCount + 1 WHERE u.id = :userId")
    void incrementPostCount(@Param("userId") Long userId);
}
