package VibeWave.repository;

import VibeWave.entity.Follow;
import VibeWave.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FollowRepository extends JpaRepository<Follow, Long> {

    List<Follow> findAllByFollower(User user);

    List<Follow> findAllByFollowing(User user);

    boolean existsByFollowerUserIdAndFollowingUserId(Long followerId, Long followingId);

    Follow findByFollowerAndFollowing(User follower, User following);
}
