package com.viseo.c360.formation.config;

import com.viseo.c360.formation.security.JwtAuthenticationEntryPoint;
import com.viseo.c360.formation.security.JwtAuthenticationProvider;
import com.viseo.c360.formation.security.JwtAuthenticationSuccessHandler;
import com.viseo.c360.formation.security.JwtAuthenticationTokenFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.Arrays;

/**
 * Created by YGU3747 on 10/11/2017
 */
@Configuration
@EnableWebSecurity
@ComponentScan("com.viseo.c360.formation")
//@EnableAutoConfiguration
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter{

    @Autowired
    private JwtAuthenticationEntryPoint unauthorizedHandler;

    @Autowired
    private JwtAuthenticationProvider authenticationProvider;

    @Bean
    @Override
    public AuthenticationManager authenticationManager() throws Exception {
        return new ProviderManager(Arrays.asList(authenticationProvider));
    }

    @Bean
    public JwtAuthenticationTokenFilter authenticationTokenFilterBean() throws Exception{
        JwtAuthenticationTokenFilter authenticationTokenFilter = new JwtAuthenticationTokenFilter();
        authenticationTokenFilter.setAuthenticationManager(authenticationManager());
        authenticationTokenFilter.setAuthenticationSuccessHandler(new JwtAuthenticationSuccessHandler());
        return authenticationTokenFilter;
    }

    @Override
    protected void configure (HttpSecurity httpSecurity) throws Exception{
        httpSecurity
                // we don't need CSRF because our token is invulnerable
                .csrf().disable()
                /*
                .authorizeRequests()
                    .antMatchers(HttpMethod.OPTIONS).permitAll()
                    .and()
                    */
                .authorizeRequests()
                    .anyRequest().permitAll()
                    .and()
                .authorizeRequests()
                //The http.antMatcher states that this HttpSecurity will only be applicable to URLs that start with /api/
                    .antMatchers("/api/**").authenticated()
                    .and()
                .formLogin()
                    .loginPage("/login").permitAll()
                    .and()

                // Call our errorHandler if authentication/authorisation fails
                .exceptionHandling()
                    .authenticationEntryPoint(unauthorizedHandler)
                    .and()
                // don't create session
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
        // Custom JWT based security filter
        httpSecurity
                .addFilterBefore(authenticationTokenFilterBean(), UsernamePasswordAuthenticationFilter.class);
        // disable page caching
        httpSecurity.headers().cacheControl();
    }


    @Override
    public void configure(WebSecurity web) throws Exception {

        web.ignoring().antMatchers("/api/collaborateurs/**", "/api/sendtoken/**", "/api/user/**");
        //web.ignoring().antMatchers(HttpMethod.OPTIONS, "/api/**");

        //web.ignoring().anyRequest();
    }


}
