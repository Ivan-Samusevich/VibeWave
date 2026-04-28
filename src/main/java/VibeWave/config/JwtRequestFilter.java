package VibeWave.config;

import VibeWave.dto.UserDto;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    private final JwtTokenUtil jwtTokenUtil;

    public JwtRequestFilter(JwtTokenUtil jwtTokenUtil) {
        this.jwtTokenUtil = jwtTokenUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        final String authorizationHeader = request.getHeader("Authorization");

        String userName = null;
        String jwt = null;
        Long userId = null;

        if(authorizationHeader != null && authorizationHeader.startsWith("Bearer ")){
            jwt = authorizationHeader.substring(7);
            userName = jwtTokenUtil.getUserNameFromToken(jwt);
            userId = jwtTokenUtil.getUserIdFromToken(jwt);
        }

        if(userName != null && SecurityContextHolder.getContext().getAuthentication() == null){
            if(!jwtTokenUtil.validateToken(jwt).isEmpty()){

                UserDto currentUser = new UserDto(userId, userName);
                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                        currentUser, null, new ArrayList<>()
                );
                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(auth);

                request.setAttribute("currentUser", currentUser);
            }
        }

        chain.doFilter(request, response);
    }
}
