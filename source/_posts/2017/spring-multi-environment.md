---
title: springmvc 多环境实践
---

起因： 项目需要实现i18n 同时还需要根据在不同环境下，文字内容展示不一样，页面屏蔽功能，controller接口返回403。

### spring i18n 页面上文字在不同环境下内容展示不一样。

spring实现的i18n按照官方教程就可以很容易实现，但是根据在不同环境下，文字内容展示则需要另外的处理。我们使用了spring的profile方式来实现不同环境的切换。
在`web.xml`中配置当前环境：
```xml
<context-param>
    <param-name>spring.profiles.active</param-name>
    <param-value>pro</param-value>
</context-param>
```

同时在spring的配置文件中配置不同环境的配置。
```xml
<beans profile="pro">
    <!-- allows for ${} replacement in the spring xml configuration from the
        application-default.properties, application-dev files on the classpath -->
    <context:property-placeholder
            location="classpath:env/application-pro.properties"
            ignore-unresolvable="true" />

</beans>

<beans profile="test">
    <context:property-placeholder
            location="classpath:env/application-test.properties"
            ignore-unresolvable="true" />
</beans>
```

这里根据不同环境配置两个不同的properties文件的原因是： 当使用spring的i18n的时候需要根据key去读取i18n中的value，但是为了在不同环境下显示不同的内容，需要在读取key的时候根据当前的环境转换为环境当前的key。举个例子：<spring:message code="sidebar.dashboard.PROJECTS" /> 这个是读取'sidebar.dashboard.PROJECTS'的i18n值，但是在pro环境下需要显示*项目*，在测试环境需要显示*测试环境*。如果只是显示的配置i18n 那肯定是不满足条件的。

通过查看`spring:message`的源码发现它有一个`resolveMessage`的方法来解析当前的code对应的值。这就是我们可以动手的地方了，在这方法里面可以根据当前的环境把code的值转换为相应环境下的code。而`env/application-pro.properties`和`env/application-test.properties`中设置的就是code在相应环境下对应的值如：

`env/application-pro.properties`

```
sidebar.dashboard.PROJECTS=sidebar.dashboard.PROJECTS.PRO
```
`env/application-test.properties`

```
sidebar.dashboard.PROJECTS=sidebar.dashboard.PROJECTS.TEST
```
同时在i18n的配置文件中会配置对应的显示内容:

`message.properties`
```properties
sidebar.dashboard.PROJECTS.PRO=Project
sidebar.dashboard.PROJECTS.TEST=Test Project
```

`message_zh_CN.properties`
```properties
sidebar.dashboard.PROJECTS.PRO=项目
sidebar.dashboard.PROJECTS.TEST=测试项目
```
我们在重写 `org.springframework.web.servlet.tags.MessageTag` 中的 `resolveMessage`方法，简单做法是 复制MessageTag 自定义一个标签，用法跟`spring:code`完全一样。`resolveMessage`:
```java
protected String resolveMessage() throws JspException, NoSuchMessageException {
        MessageSource messageSource = getMessageSource();
        if (messageSource == null) {
            throw new JspTagException("No corresponding MessageSource found");
        }

        // Evaluate the specified MessageSourceResolvable, if any.
        if (this.message != null) {
            // We have a given MessageSourceResolvable.
            return messageSource.getMessage(this.message, getRequestContext().getLocale());
        }

        if (this.code != null || this.text != null) {

            // 只是多了根据环境去转换当前的code的代码
            String keyCode = MessagePropertiesUtil.getProperty(this.code);
            if(!StringUtils.isEmpty(keyCode)){
                setCode(keyCode);
            }

            // We have a code or default text that we need to resolve.
            Object[] argumentsArray = resolveArguments(this.arguments);
            if (!this.nestedArguments.isEmpty()) {
                argumentsArray = appendArguments(argumentsArray,
                        this.nestedArguments.toArray());
            }

            if (this.text != null) {
                // We have a fallback text to consider.
                return messageSource.getMessage(
                        this.code, argumentsArray, this.text, getRequestContext().getLocale());
            }
            else {
                // We have no fallback text to consider.
                return messageSource.getMessage(
                        this.code, argumentsArray, getRequestContext().getLocale());
            }
        }

        // All we have is a specified literal text.
        return this.text;
    }
```

在看下`MessagePropertiesUtil`的实现： 会把当前环境注入进来，同时把对应环境转换的key加载到props属性中。

```java
@Component
public class MessagePropertiesUtil implements InitializingBean {

    @Value("${spring.profiles.active}")
    private String env;

    private static Properties props = new Properties();

    @Override
    public void afterPropertiesSet() throws Exception {
        Resource resource = new ClassPathResource("/env/application-" + env + ".properties");
        props = PropertiesLoaderUtils.loadProperties(resource);
    }

    public static String getProperty(String key){
        return props.getProperty(key);
    }
}
```

显示我们在发布代码的时候，就需要修改下web.xml 的spring.profile.active 参数就可以配置显示不同环境显示不同内容的功能了。

---
上面算是一个比较别扭的实现方案，因为我们还是写了读取properties的类来读取，但是spring其实是已经把properties读取了一遍。下面介绍一个更加优雅的实现方案。

首先需要了解到一个知识点：当我们使用
```
<context:property-placeholder
            location="classpath:env/application-test.properties"
            ignore-unresolvable="true" />
```
来配置properties时， spring不会把properties 注入到spring的 environment属性中，但是如果是使用了注解 @PropertySource 来加载properties，spring 则会把properties 注入到 environment 中。

我们可以看到 MessageTag 继承的 HtmlEscapingAwareTag也继承了 RequestContextAwareTag类，也就是说我们可以获取到spring的 Environment对象。这就好办了，只需从environment中获取application-${dev}.properties对应的属性就可以随意切换不同环境下显示的内容了。

首先把我们在spring配置文件的<context:property-placeholder> 代码注释掉或者删掉：

```xml
<!--<beans profile="pro">
		<context:property-placeholder
				location="classpath:env/application-pro.properties"
				ignore-unresolvable="true" />
	</beans>

	<beans profile="qcloud">
		<context:property-placeholder
				location="classpath:env/application-qcloud.properties"
				ignore-unresolvable="true" />
	</beans>-->
```

添加EnvConfig类

```java
/**
 * 使用 @PropertySource 配置的方式会把properties注入到spring 的 Environment中，也就是说可以在Environment获取properties中的属性，
 * 而使用：
 * <context:property-placeholder location="classpath:env/application-pro.properties" ignore-unresolvable="true" />
 * 这种方式则不会把properties 注入到 Environment 中。
 * ${spring.profiles.active} 会替换为web.xml 中定义的 spring.profiles.active context-param 设置的值
 *
 */
@Configuration
@PropertySource(value = "classpath:env/application-${spring.profiles.active}.properties", ignoreResourceNotFound = true)
public class EnvConfig {

    @Bean
    public PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer() {
        return new PropertySourcesPlaceholderConfigurer();
    }
}
```

修改 resolveMessage 中的实现：
```java
protected String resolveMessage() throws JspException, NoSuchMessageException {
        MessageSource messageSource = getMessageSource();
        if (messageSource == null) {
            throw new JspTagException("No corresponding MessageSource found");
        }

        // Evaluate the specified MessageSourceResolvable, if any.
        if (this.message != null) {
            // We have a given MessageSourceResolvable.
            return messageSource.getMessage(this.message, getRequestContext().getLocale());
        }

        if (this.code != null || this.text != null) {
            final Environment environment = this.getRequestContext().getWebApplicationContext().getEnvironment();
            if (environment != null){
                String keyCode = environment.getProperty(this.code);
                if(!StringUtils.isEmpty(keyCode)){
                    setCode(keyCode);
                }
            }

            // We have a code or default text that we need to resolve.
            Object[] argumentsArray = resolveArguments(this.arguments);
            if (!this.nestedArguments.isEmpty()) {
                argumentsArray = appendArguments(argumentsArray,
                        this.nestedArguments.toArray());
            }

            if (this.text != null) {
                // We have a fallback text to consider.
                return messageSource.getMessage(
                        this.code, argumentsArray, this.text, getRequestContext().getLocale());
            }
            else {
                // We have no fallback text to consider.
                return messageSource.getMessage(
                        this.code, argumentsArray, getRequestContext().getLocale());
            }
        }

        // All we have is a specified literal text.
        return this.text;
    }
```

这样实现就非常简单明了了。

### 实现不同环境下隐藏页面内容。

实现： 最简单的做法是写一个JSP tag 来判断当前是啥环境，如果满足条件则隐藏内容。正好spring提供了一个可以获取当前环境的JspTag父类`RequestContextAwareTag`。那我们实现就简单了，继承`RequestContextAwareTag` 重写`doStartTagInternal`方法，在自定义标签。

首先继承`RequestContextAwareTag`类：

```java
public class EnvTag extends RequestContextAwareTag {

    private String env;

    @Override
    protected int doStartTagInternal() throws Exception {
        final Environment environment = this.getRequestContext().getWebApplicationContext().getEnvironment();
        if(environment != null){
            final String[] profiles = environment.getActiveProfiles();
            if(ArrayUtils.contains(profiles, this.env)){
                return SKIP_BODY;
            }
        }
        return EVAL_BODY_INCLUDE;
    }

    public String getEnv() {
        return env;
    }

    public void setEnv(String env) {
        this.env = env;
    }
}
```
在tld中添加自定义标签。

```xml

<?xml version="1.0" encoding="UTF-8" ?>
    <taglib xmlns="http://java.sun.com/xml/ns/j2ee" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://java.sun.com/xml/ns/j2ee http://java.sun.com/xml/ns/j2ee/web-jsptaglibrary_2_0.xsd" version="2.0">
    <description>Conditional profile Tag</description>
    <tlib-version>2.1</tlib-version>
    <short-name>ProfileConditionTag</short-name>
    <uri></uri>
    <tag>
         <name>env</name>
          <tag-class>com.xxx.xxx.xxx.jstl.tag.EnvTag</tag-class>
          <description>控制在什么环境下不显示</description>
          <body-content>JSP</body-content>
          <attribute>
              <name>env</name>
              <required>true</required>
          </attribute>
      </tag>
</taglib>

```

在页面中使用：
```jsp
<gui:env env="test">
    test env
</gui:env>
```
自定义标签的教程请自行google。

### 特定环境下接口返回403。

首先自定义一个注解

```java
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface EnvConfig {
    String[] value() default {};
}
```

在我们需要拦截的请求的controller，或者方法上配置这个注解

```java
@EnvConfig(value={"test.controller.enable"})
@Controller
public class TestController {

}
```

或者方法上：

```java
@EnvConfig(value={"test.method.enable"})
@RequestMapping(method = RequestMethod.GET, value = "/test")
public String test(Model model, RedirectAttributes redirectAttributes){
    //todo
}
```

写一个spring的拦截器解析方法上和类上的注解，如果注解上有EnvConfig类，同时里面的设置的value的key在properties中对应的值为true，则抛错。

```java
@Component
public class ConfigInterceptor implements HandlerInterceptor {

    @Autowired
    Environment environment;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        HandlerMethod hm = (HandlerMethod) handler;
        Method method = hm.getMethod();

        if (method.getDeclaringClass().isAnnotationPresent(EnvConfig.class)) {
            String[] classValue = method.getDeclaringClass().getAnnotation(EnvConfig.class).value();
            if(isValueDisable(classValue)){
                throw new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND);
            }

        }
        if (method.isAnnotationPresent(EnvConfig.class)) {
            String[] methodValue = method.getAnnotation(EnvConfig.class).value();
            if(isValueDisable(methodValue)){
                throw new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND);
            }
        }
        return true;
    }

    private boolean isValueDisable(String[] configs) {
        if (configs != null && configs.length > 0) {
            for (String config : configs) {
                String configValue = environment.getProperty(config);
                if (!StringUtils.isEmpty(configValue) && !Boolean.valueOf(configValue)) {
                    return true;
                }
            }
        }
        return false;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {

    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {

    }

}
```

在spring的配置文件添加拦截器配置：

```xml
<mvc:interceptors>
    <bean class="com.xxx.xxx.ConfigInterceptor" ></bean>
    <bean class="com.xxx.xxx.LegalInterceptor" ></bean>
</mvc:interceptors>
```

在看下properties中的配置

```properties
test.method.enable=false
test.controller.enable=false
```

