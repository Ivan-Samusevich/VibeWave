package VibeWave.repository;

import VibeWave.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByEmail(String email);

    User findByEmail(String email);

    User findByUserId(Long userId);

    User findByUserName(String userName);

    @Query("SELECT u.userName FROM User u WHERE u.userId = :userid")
    String getUsernameById(@Param("userid") Long userId);

    List<User> findByUserNameContainingIgnoreCase(String searchText);
}
