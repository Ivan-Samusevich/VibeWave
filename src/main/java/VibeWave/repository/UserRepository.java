package VibeWave.repository;

import VibeWave.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByEmail(String email);

    boolean existsByEmailAndPassword(String email, String password);

    User findByEmail(String email);

    @Query("SELECT u.userName FROM User u WHERE u.userId = :userid")
    String getUsernameById(@Param("userid") Long userId);

    @Query("SELECT u.userId FROM User u WHERE u.userName = :username")
    Long getIdByUsername(@Param("username") String userName);
}
