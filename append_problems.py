import os

problems = {
    'information-content.qmd': '''
## Practice Problems

::: {.thm-box .thm-problem}
### Problem 1: Calculating Surprisal
Calculate the surprisal of rolling a 6 on a fair 6-sided die, in both bits and nats. How does this compare to flipping two heads in a row on a fair coin?
:::
''',
    'entropy.qmd': '''
## Practice Problems

::: {.thm-box .thm-problem}
### Problem 1: Biased Coin Entropy
Prove that the entropy of a fair coin flip is exactly 1 bit. What happens to the theoretical entropy $H(X)$ if the coin is heavily biased such that $P(Heads) = 0.99$?
:::
''',
    'mutual-information.qmd': '''
## Practice Problems

::: {.thm-box .thm-problem}
### Problem 1: Independence
If two random variables $X$ and $Y$ are statistically independent, prove directly from the summation definition that their Mutual Information $I(X;Y)$ is exactly zero.
:::
''',
    'cross-entropy.qmd': '''
## Practice Problems

::: {.thm-box .thm-problem}
### Problem 1: Binary Cross-Entropy
Calculate the Binary Cross-Entropy loss for a single data point where the true label is $y=1$ and the model's predicted probability is $p=0.01$. Why does the loss become so massive?
:::
''',
    'perplexity.qmd': '''
## Practice Problems

::: {.thm-box .thm-problem}
### Problem 1: Language Model Perplexity
A language model assigns a uniform probability over a vocabulary of $10,000$ words. What is its perplexity? If a better model achieves a perplexity of $50$, what does this physically mean in terms of its predictive power?
:::
''',
    'kl-divergence.qmd': '''
## Practice Problems

::: {.thm-box .thm-problem}
### Problem 1: The Asymmetry of KL
Provide a concrete, numerical example showing that $D_{KL}(P \\| Q) \\neq D_{KL}(Q \\| P)$ using two simple discrete probability distributions (e.g., $P=[0.5, 0.5]$ and $Q=[0.9, 0.1]$).
:::
''',
    'jensen-shannon-divergence.qmd': '''
## Practice Problems

::: {.thm-box .thm-problem}
### Problem 1: GAN Stabilization
Explain why the strict boundedness ($0 \\le JSD \\le \\log 2$) makes Jensen-Shannon Divergence vastly superior to KL divergence for training early-stage Generative Adversarial Networks (GANs), especially when the generator and real distributions have disjoint supports.
:::
''',
    'f-divergence.qmd': '''
## Practice Problems

::: {.thm-box .thm-problem}
### Problem 1: Deriving KL from f-Divergence
Starting from the generalized f-divergence integral formula $D_f(P \\| Q) = \\int q(x) f\\left(\\frac{p(x)}{q(x)}\\right) dx$, prove that setting the generator function to $f(t) = t \\log t$ successfully recovers the Kullback-Leibler divergence.
:::
''',
    'wasserstein-distance.qmd': '''
## Practice Problems

::: {.thm-box .thm-problem}
### Problem 1: Earth Mover's Gradients
Explain intuitively why the Earth Mover's distance between two completely non-overlapping distributions still provides a meaningful, continuous gradient, whereas JS Divergence saturates and provides a gradient of exactly zero.
:::
''',
    'fisher-information.qmd': '''
## Practice Problems

::: {.thm-box .thm-problem}
### Problem 1: Natural Gradients
How does Natural Gradient Descent utilize the inverse of the Fisher Information Matrix to precondition its gradient steps? Why is this necessary when moving through the Riemannian manifold of probability distributions?
:::
''',
    'evidence-lower-bound-elbo.qmd': '''
## Practice Problems

::: {.thm-box .thm-problem}
### Problem 1: VAE Trade-offs
In the Variational Autoencoder ELBO equation, explain the competing roles of the Reconstruction Term and the KL Regularization term. What happens to the learned latent space if the regularization weight is set to exactly zero?
:::
''',
    'markov-chain.qmd': '''
## Practice Problems

::: {.thm-box .thm-problem}
### Problem 1: The Markov Property
Define the Markov Property in your own words. Why is this memoryless assumption absolutely mathematically necessary for formulating Reinforcement Learning environments as Markov Decision Processes (MDPs)?
:::
''',
    'stochastic-matrices-and-markov-chains.qmd': '''
## Practice Problems

::: {.thm-box .thm-problem}
### Problem 1: Stationary Distributions
Given a $2 \\times 2$ stochastic transition matrix $P = \\begin{bmatrix} 0.8 & 0.2 \\\\ 0.3 & 0.7 \\end{bmatrix}$, find the stationary distribution $\\pi$ by solving the left-eigenvector equation $\\pi P = \\pi$.
:::
''',
    'information-bottleneck.qmd': '''
## Practice Problems

::: {.thm-box .thm-problem}
### Problem 1: The IB Trade-off
In the Information Bottleneck objective $\\mathcal{L} = I(X;Z) - \\beta I(Z;Y)$, what happens to the learned representation $Z$ as the Lagrange multiplier $\\beta \\to 0$? What happens when $\\beta \\to \\infty$?
:::
''',
    'evaluation-metrics-for-ranking-and-information-retrieval.qmd': '''
## Practice Problems

::: {.thm-box .thm-problem}
### Problem 1: Mean Reciprocal Rank
Calculate the MRR (Mean Reciprocal Rank) for a search engine that processes three distinct user queries, where the single correct result is found at rank $1$, rank $3$, and rank $2$ respectively.
:::
'''
}

base_dir = 'notes/information-theory/'

for filename, problem_text in problems.items():
    filepath = os.path.join(base_dir, filename)
    if os.path.exists(filepath):
        with open(filepath, 'a') as f:
            f.write('\n' + problem_text)
        print(f"Appended problem to {filename}")
    else:
        print(f"Warning: {filename} not found.")
