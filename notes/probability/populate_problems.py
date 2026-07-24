import os

files = {
    "probability-basics.qmd": """---
title: "Probability Basics"
---

## Overview
Probability is a measure of the likelihood of an event occurring, quantified as a number between 0 and 1. Kolmogorov's axioms state that:
1. $P(E) \\ge 0$ for any event $E$.
2. $P(\\Omega) = 1$ for the sample space $\\Omega$.
3. For mutually exclusive events $E_1, E_2, \\dots$, $P(\\bigcup_{i=1}^\\infty E_i) = \\sum_{i=1}^\\infty P(E_i)$.

## Practice Problems

::: {.thm-box .thm-example}
### Problem 1: Basic Axioms
If $P(A) = 0.4$, $P(B) = 0.5$, and $A$ and $B$ are mutually exclusive, what is $P(A \\cup B)$?
:::

::: {.thm-box .thm-example}
### Problem 2: Complement Rule
A machine learning model predicts a class correctly with probability $0.85$. What is the probability that it makes an incorrect prediction?
:::
""",
    "probability-distributions-of-a-single-random-variable.qmd": """---
title: "Probability Distributions of a Single Random Variable"
---

## Overview
A random variable $X$ maps outcomes to real numbers. Its distribution describes how probabilities are assigned to these numbers.
*   **Discrete RV:** Uses a Probability Mass Function (PMF) $P(X=x)$.
*   **Continuous RV:** Uses a Probability Density Function (PDF) $f(x)$.

## Practice Problems

::: {.thm-box .thm-example}
### Problem 1: Valid PMF
A discrete random variable $X$ has PMF $P(X=k) = c k$ for $k \\in \\{1, 2, 3, 4\\}$. What must the value of the constant $c$ be?
:::

::: {.thm-box .thm-example}
### Problem 2: Valid PDF
A continuous random variable has PDF $f(x) = a x^2$ for $x \\in [0, 1]$, and $0$ otherwise. Find the constant $a$.
:::
""",
    "joint-probabilities-of-multiple-variables.qmd": """---
title: "Joint Probabilities of Multiple Variables"
---

## Overview
Joint probability describes the likelihood of two or more events happening at the same time. For two random variables $X$ and $Y$, their joint distribution is $P(X=x, Y=y)$ or $f(x, y)$.

## Practice Problems

::: {.thm-box .thm-example}
### Problem 1: Discrete Joint Distribution
Let $X$ and $Y$ be binary variables (0 or 1). The joint PMF is $P(0,0)=0.1, P(0,1)=0.2, P(1,0)=0.3, P(1,1)=0.4$. Check that this is a valid joint distribution. What is $P(X=1, Y=0)$?
:::

::: {.thm-box .thm-example}
### Problem 2: Continuous Joint PDF
Suppose $f(x, y) = c(x+y)$ for $0 \\le x \\le 1$ and $0 \\le y \\le 1$. What must $c$ be for this to be a valid joint PDF?
:::
""",
    "marginal-probabilities.qmd": """---
title: "Marginal Probabilities"
---

## Overview
Marginalization allows us to find the distribution of one variable by summing or integrating out the other variables from a joint distribution.
*   Discrete: $P(X=x) = \\sum_y P(X=x, Y=y)$
*   Continuous: $f_X(x) = \\int f(x,y) dy$

## Practice Problems

::: {.thm-box .thm-example}
### Problem 1: Discrete Marginalization
Using the joint PMF: $P(0,0)=0.1, P(0,1)=0.2, P(1,0)=0.3, P(1,1)=0.4$. Find the marginal probability $P(X=1)$.
:::

::: {.thm-box .thm-example}
### Problem 2: Continuous Marginalization
Given $f(x, y) = x+y$ for $x,y \\in [0,1]$, find the marginal PDF $f_X(x)$.
:::
""",
    "conditional-probabilities.qmd": """---
title: "Conditional Probabilities"
---

## Overview
Conditional probability is the probability of an event occurring given that another event has already occurred: $P(A|B) = \\frac{P(A \\cap B)}{P(B)}$.

## Practice Problems

::: {.thm-box .thm-example}
### Problem 1: Basic Conditional Probability
Suppose a medical test is positive $90\\%$ of the time when a patient has a disease. This represents $P(\\text{Test} = + \\mid \\text{Disease} = \\text{True}) = 0.9$. If $P(\\text{Test} = + \\text{ and } \\text{Disease} = \\text{True}) = 0.09$, what is the overall prevalence of the disease $P(\\text{Disease} = \\text{True})$?
:::

::: {.thm-box .thm-example}
### Problem 2: Using Joint and Marginal
Using the joint PMF $P(X,Y)$ where $P(0,0)=0.1, P(0,1)=0.2, P(1,0)=0.3, P(1,1)=0.4$, compute the conditional probability $P(Y=1 \\mid X=1)$.
:::
""",
    "independence.qmd": """---
title: "Independence"
---

## Overview
Two events A and B are independent if the occurrence of one does not affect the probability of the other: $P(A \\cap B) = P(A)P(B)$, or equivalently, $P(A|B) = P(A)$.

## Practice Problems

::: {.thm-box .thm-example}
### Problem 1: Checking Independence
A fair coin is flipped twice. Let $A$ be the event "first flip is Heads" and $B$ be "second flip is Heads". Are $A$ and $B$ independent? Show it mathematically.
:::

::: {.thm-box .thm-example}
### Problem 2: Joint Distribution of Independent Variables
If $X$ and $Y$ are independent random variables with $P(X=1) = 0.6$ and $P(Y=1) = 0.8$, what is $P(X=1, Y=1)$?
:::
""",
    "bayes'-rule.qmd": """---
title: "Bayes' Rule"
---

## Overview
Bayes' theorem relates conditional probabilities and is fundamental in Machine Learning for updating beliefs:
$$P(A|B) = \\frac{P(B|A)P(A)}{P(B)}$$

## Practice Problems

::: {.thm-box .thm-example}
### Problem 1: Medical Testing
A disease has a prevalence of $1\\%$ ($P(D)=0.01$). A test has a true positive rate of $95\\%$ ($P(+|D)=0.95$) and a false positive rate of $5\\%$ ($P(+|D^c)=0.05$). If a patient tests positive, what is the probability they actually have the disease $P(D|+)$?
:::

::: {.thm-box .thm-example}
### Problem 2: Spam Filtering
Suppose $30\\%$ of emails are spam. The word "buy" appears in $80\\%$ of spam emails and $10\\%$ of non-spam emails. If you see an email with the word "buy", what is the probability it is spam?
:::
""",
    "statistics-basics.qmd": """---
title: "Statistics Basics"
---

## Overview
Statistics summarize distributions.
*   **Expectation (Mean):** $\\mathbb{E}[X] = \\sum x P(x)$ or $\\int x f(x) dx$.
*   **Variance:** $\\text{Var}(X) = \\mathbb{E}[(X - \\mu)^2] = \\mathbb{E}[X^2] - (\\mathbb{E}[X])^2$.
*   **Covariance:** Measures how two variables change together.

## Practice Problems

::: {.thm-box .thm-example}
### Problem 1: Expectation
Let $X$ represent the roll of a fair 6-sided die. What is $\\mathbb{E}[X]$?
:::

::: {.thm-box .thm-example}
### Problem 2: Variance
If $\\mathbb{E}[X] = 3.5$ for a fair 6-sided die, compute $\\text{Var}(X)$. You will need $\\mathbb{E}[X^2]$.
:::
""",
    "transformation-of-random-variables.qmd": """---
title: "Transformation of Random Variables"
---

## Overview
If $Y = g(X)$, the distribution of $Y$ can be found from the distribution of $X$. For continuous variables, if $g$ is monotonic, $f_Y(y) = f_X(g^{-1}(y)) \\left| \\frac{d}{dy} g^{-1}(y) \\right|$.

## Practice Problems

::: {.thm-box .thm-example}
### Problem 1: Linear Transformation of Expectation and Variance
If $\\mathbb{E}[X] = \\mu$ and $\\text{Var}(X) = \\sigma^2$, what are $\\mathbb{E}[aX + b]$ and $\\text{Var}(aX + b)$ for constants $a$ and $b$?
:::

::: {.thm-box .thm-example}
### Problem 2: Continuous Transformation
Let $X \\sim \\text{Uniform}(0, 1)$. Find the PDF of $Y = -\\ln(X)$.
:::
""",
    "uniform-distribution.qmd": """---
title: "Uniform Distribution"
---

## Overview
A continuous uniform distribution has constant probability density over a specific interval $[a, b]$.
$f(x) = \\frac{1}{b-a}$ for $x \\in [a, b]$.

## Practice Problems

::: {.thm-box .thm-example}
### Problem 1: Probability in an Interval
If $X \\sim \\text{Uniform}(0, 10)$, what is $P(2 < X < 5)$?
:::

::: {.thm-box .thm-example}
### Problem 2: Mean and Variance
Derive the expectation $\\mathbb{E}[X]$ for $X \\sim \\text{Uniform}(a, b)$.
:::
""",
    "bernoulli-distribution.qmd": """---
title: "Bernoulli Distribution"
---

## Overview
Models a single trial with two possible outcomes (success/failure), where $P(X=1) = p$ and $P(X=0) = 1-p$.

## Practice Problems

::: {.thm-box .thm-example}
### Problem 1: Bernoulli Basics
If $X \\sim \\text{Bernoulli}(0.7)$, what is the variance of $X$?
:::

::: {.thm-box .thm-example}
### Problem 2: Coin Flips
If you flip a biased coin that lands Heads with probability $0.6$, what is the expected value of an indicator variable that is $1$ if Heads and $0$ if Tails?
:::
""",
    "categorical-and-multinomial-distributions.qmd": """---
title: "Categorical and Multinomial Distributions"
---

## Overview
*   **Categorical:** Generalization of Bernoulli to $K$ categories. (Roll of a $K$-sided die).
*   **Multinomial:** Generalization of Binomial to $K$ categories. (Counts of outcomes in $N$ rolls of a $K$-sided die).

## Practice Problems

::: {.thm-box .thm-example}
### Problem 1: Categorical Probabilities
A word in a vocabulary of size 3 can be generated with probabilities $\\boldsymbol{p} = [0.2, 0.5, 0.3]$. What is the probability of observing the sequence (word 2, word 1) assuming independence?
:::

::: {.thm-box .thm-example}
### Problem 2: Multinomial Support
If you draw $N=10$ samples from a categorical distribution with 3 classes, what is the sum of the counts $c_1 + c_2 + c_3$?
:::
""",
    "gaussian-distribution.qmd": """---
title: "Gaussian Distribution"
---

## Overview
The Normal (Gaussian) distribution is ubiquitous in ML due to the Central Limit Theorem.
$f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} \\exp\\left( -\\frac{1}{2} \\left(\\frac{x-\\mu}{\\sigma}\\right)^2 \\right)$

## Practice Problems

::: {.thm-box .thm-example}
### Problem 1: Standard Normal
For a standard normal variable $Z \\sim \\mathcal{N}(0, 1)$, what is the value of the PDF at $z=0$?
:::

::: {.thm-box .thm-example}
### Problem 2: Linear Combinations
If $X \\sim \\mathcal{N}(1, 2)$ and $Y \\sim \\mathcal{N}(0, 3)$ are independent, what is the distribution of $X+Y$?
:::
""",
    "beta-distribution.qmd": """---
title: "Beta Distribution"
---

## Overview
A continuous distribution on the interval $[0,1]$, commonly used as a prior for probability parameters (like the bias of a coin).
$f(x; \\alpha, \\beta) \\propto x^{\\alpha-1}(1-x)^{\\beta-1}$

## Practice Problems

::: {.thm-box .thm-example}
### Problem 1: Beta as a Prior
If you have a Beta$(2, 2)$ prior on the probability of a coin landing Heads, what does the PDF shape look like? (Is it uniform, U-shaped, or bell-shaped around 0.5?)
:::

::: {.thm-box .thm-example}
### Problem 2: Conjugacy (Conceptual)
Why is the Beta distribution called the "conjugate prior" to the Binomial distribution?
:::
""",
    "dirichlet-distribution.qmd": """---
title: "Dirichlet Distribution"
---

## Overview
The multivariate generalization of the Beta distribution. It is used as a prior for Categorical or Multinomial distributions (e.g., in Latent Dirichlet Allocation).

## Practice Problems

::: {.thm-box .thm-example}
### Problem 1: Dirichlet Support
If $\\boldsymbol{x} \\sim \\text{Dirichlet}(\\boldsymbol{\\alpha})$, what constraint must the components $x_1, x_2, \\dots, x_K$ satisfy?
:::

::: {.thm-box .thm-example}
### Problem 2: Symmetric Dirichlet
What does it mean for a Dirichlet distribution to be "symmetric", e.g., $\\boldsymbol{\\alpha} = [0.1, 0.1, 0.1]$? How does $\\alpha < 1$ affect the samples?
:::
""",
    "mixture-distributions.qmd": """---
title: "Mixture Distributions"
---

## Overview
Complex distributions can be formed by taking a weighted sum (mixture) of simpler distributions (e.g., Gaussian Mixture Models).
$P(x) = \\sum_{k=1}^K \\pi_k P_k(x)$

## Practice Problems

::: {.thm-box .thm-example}
### Problem 1: Mixture Weights
In a mixture model $P(x) = \\pi_1 P_1(x) + \\pi_2 P_2(x)$, what constraints must the mixture weights $\\pi_1$ and $\\pi_2$ satisfy?
:::

::: {.thm-box .thm-example}
### Problem 2: GMM Mean
For a Gaussian Mixture Model with two components $\\mathcal{N}(\\mu_1, \\sigma_1^2)$ and $\\mathcal{N}(\\mu_2, \\sigma_2^2)$ and weights $\\pi_1, \\pi_2$, what is the overall expected value $\\mathbb{E}[X]$?
:::
""",
    "von-mises-fisher-distribution.qmd": """---
title: "Von Mises-Fisher Distribution"
---

## Overview
A probability distribution on the $(p-1)$-dimensional sphere. It is often used in directional statistics (e.g., modeling word embeddings mapped to a hypersphere).

## Practice Problems

::: {.thm-box .thm-example}
### Problem 1: Domain
What is the sample space (domain) of a von Mises-Fisher distribution in 3D space?
:::

::: {.thm-box .thm-example}
### Problem 2: Parameters
The vMF distribution has parameters $\\boldsymbol{\\mu}$ and $\\kappa$. What do these parameters represent?
:::
""",
    "distribution-summary.qmd": """---
title: "Distribution Summary"
---

## Overview
A wrap-up of the relationships between the various probability distributions (e.g., Bernoulli $\\rightarrow$ Binomial, Categorical $\\rightarrow$ Multinomial, Beta as conjugate to Binomial).

## Practice Problems

::: {.thm-box .thm-example}
### Problem 1: Conjugate Priors
Match the likelihood with its conjugate prior:
1. Bernoulli/Binomial
2. Categorical/Multinomial
3. Gaussian (mean parameter)

Options: Beta, Dirichlet, Gaussian.
:::

::: {.thm-box .thm-example}
### Problem 2: Limiting Cases
As the number of trials $N \\rightarrow \\infty$, what continuous distribution does the Binomial distribution approach (by the Central Limit Theorem)?
:::
"""
}

base_path = "/home/jackwu/Desktop/Repos/lemoon01110.github.io/notes/probability/"
for filename, content in files.items():
    with open(os.path.join(base_path, filename), "w") as f:
        f.write(content)

print("Successfully wrote all files.")
