Problem 1: The Exponential Distribution

For a continuous random variable $X$ distributed exponentially with a rate parameter $\lambda > 0$, the probability density function is $f(x) = \lambda e^{-\lambda x}$ for $x \ge 0$.
Part A: Calculate its differential entropy $h(X)$ in nats.
Part B: Conceptually, what happens to the differential entropy as the rate $\lambda$ becomes very large? Why does this make physical sense?

Problem 2: The Gaussian (Normal) Distribution

For a continuous random variable $X$ with a normal distribution, the probability density function is $f(x) = \frac{1}{\sqrt{2\pi\sigma^2}} e^{-\frac{(x-\mu)^2}{2\sigma^2}}$ for $-\infty < x < \infty$.
Part A: Calculate its differential entropy $h(X)$ in nats. (Hint: You do not need to do complex integration for the second term if you recognize it as the expected value or variance!)
Part B: Does the mean ($\mu$) affect the entropy of the distribution? Why or why not?

Problem 3: The Linear Sloped Distribution

Consider a continuous random variable $X$ with a probability density function $f(x) = 2x$ on the interval $[0, 1]$.
Part A: Calculate its differential entropy $h(X)$ in nats. (Hint: You will need to use Integration by Parts: $\int u \, dv = uv - \int v \, du$.)
Part B: The uniform distribution on the interval $[0, 1]$ has an entropy of exactly $0$. Is the entropy of this linear distribution higher or lower than $0$? Geometrically, why must this be the case?

Problem 4: The Laplace Distribution

For a continuous random variable $X$ following a Laplace distribution with scale parameter $b > 0$ centered at $0$, the probability density function is $f(x) = \frac{1}{2b} e^{-\frac{|x|}{b}}$ for $-\infty < x < \infty$.
Part A: Calculate its differential entropy $h(X)$ in nats. (Hint: Because the function is perfectly symmetric, you can just integrate from $0$ to $\infty$ and multiply by 2).
Part B: Compare your answer to the Uniform distribution's entropy ($\ln(w)$). If a Laplace distribution and a Uniform distribution have the exact same entropy, how does the scale $b$ relate to the width $w$?

Problem 5: The Scaling Property

Suppose you have a continuous random variable $X$ with a known probability density function $f_X(x)$ and a known differential entropy $h(X)$. You create a new variable $Y = cX$, where $c$ is a positive constant. The probability density function of $Y$ is $f_Y(y) = \frac{1}{c} f_X\left(\frac{y}{c}\right)$.
Part A: Prove that the differential entropy of the new variable is $h(Y) = h(X) + \ln(c)$.
Part B: What happens to the entropy if you multiply your data by a constant $c$ that is less than 1?
