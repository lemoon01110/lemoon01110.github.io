Short Summary
The lower bound ($0$) exists because Jensen-Shannon Divergence (JSD) is built by adding two Kullback-Leibler (KL) divergences together, and we already proved via Gibbs' Inequality that KL divergence can never be negative. The upper bound ($\log_b(2)$) happens because JSD measures the distance from each distribution to their exact 50/50 midpoint ($M$). The maximum possible distance occurs when the two distributions have zero overlap. In that extreme case, the probability of $P$ is exactly twice as large as the midpoint $M$, which elegantly reduces the entire complex formula down to the logarithm of $2$.

Long Summary
While KL Divergence is a fantastic tool, it has two major mathematical flaws for measuring distance: it is asymmetrical ($D_{KL}(P \parallel Q) \neq D_{KL}(Q \parallel P)$), and it can shoot off to infinity. Jensen-Shannon Divergence (JSD) fixes both by introducing a shared "middle ground" distribution, $M = \frac{1}{2}(P + Q)$. Instead of asking "How far is $P$ from $Q$?", JSD asks "How far are $P$ and $Q$ from their own average?"

Because we are dealing with probabilities that must sum to 1, there is a hard limit on how "far apart" two distributions can be. The absolute worst-case scenario is that $P$ and $Q$ are completely disjoint (e.g., $P$ only happens on even numbers, $Q$ only happens on odd numbers). Because the mixture $M$ is a 50/50 split of the two, the fraction $\frac{P}{M}$ hits a hard mathematical ceiling of exactly $2$. The log rule immediately locks the maximum divergence to $\log_b(2)$.

1. The Setup

Let's look at the definition of the Jensen-Shannon Divergence. It takes the KL divergence from $P$ to the midpoint $M$, and averages it with the KL divergence from $Q$ to the midpoint $M$:

$$JSD(P \parallel Q) = \frac{1}{2} D_{KL}(P \parallel M) + \frac{1}{2} D_{KL}(Q \parallel M)$$

Where the midpoint $M$ is defined as the perfect average of the two distributions:


$$M(x) = \frac{P(x) + Q(x)}{2}$$

2. Proving the Lower Bound ($JSD \ge 0$)

This is the easy part, because you already laid the groundwork for it!

In our previous proof of Gibbs' Inequality, we proved definitively that for any valid distributions, the KL divergence is strictly non-negative ($D_{KL} \ge 0$).

Because JSD is just the sum of two KL divergences multiplied by positive fractions ($\frac{1}{2}$), it is mathematically impossible for the result to be negative.


$$JSD(P \parallel Q) \ge 0$$

When does it equal 0? It equals $0$ only when $P$ and $Q$ perfectly match the midpoint $M$, meaning $P = Q$.

3. Proving the Upper Bound ($JSD \le \log_b(2)$)

To find the absolute maximum value, let's zoom in on just the first half of the JSD formula: $D_{KL}(P \parallel M)$.

$$D_{KL}(P \parallel M) = \sum_{x} P(x) \log_b\left( \frac{P(x)}{M(x)} \right)$$

Let's substitute our definition of $M(x)$ into the denominator:


$$D_{KL}(P \parallel M) = \sum_{x} P(x) \log_b\left( \frac{P(x)}{\frac{1}{2}P(x) + \frac{1}{2}Q(x)} \right)$$

The Crucial Logic Step:
Look at that denominator: $\frac{1}{2}P(x) + \frac{1}{2}Q(x)$.
Because $Q(x)$ is a probability, we know for an absolute fact that $Q(x) \ge 0$.

If we completely delete $\frac{1}{2}Q(x)$ from the denominator, the denominator must get smaller (or stay the same if $Q(x)$ was 0).
When you make the denominator of a fraction smaller, the overall fraction gets bigger.

Therefore, we can establish a strict mathematical inequality:


$$\frac{P(x)}{\frac{1}{2}P(x) + \frac{1}{2}Q(x)} \le \frac{P(x)}{\frac{1}{2}P(x)}$$

The $P(x)$ on the top and bottom of that right-side fraction perfectly cancel out, leaving just $\frac{1}{1/2}$, which is $2$.


$$\frac{P(x)}{M(x)} \le 2$$

Finishing the Bound:
Because the logarithm is a strictly increasing function, if the inside of the log is $\le 2$, the whole log is $\le \log_b(2)$. We can substitute this maximum value back into our KL sum:


$$D_{KL}(P \parallel M) \le \sum_{x} P(x) \log_b(2)$$

Since $\log_b(2)$ is just a constant number, pull it out to the front:


$$D_{KL}(P \parallel M) \le \log_b(2) \sum_{x} P(x)$$

Since the sum of all probabilities $\sum P(x)$ must equal $1$:


$$D_{KL}(P \parallel M) \le \log_b(2)$$

By the exact same logic, the second half of the equation is also bounded:


$$D_{KL}(Q \parallel M) \le \log_b(2)$$

The Final Combination:
Plug these maximums back into the main JSD formula:


$$JSD(P \parallel Q) \le \frac{1}{2}(\log_b(2)) + \frac{1}{2}(\log_b(2))$$

$$JSD(P \parallel Q) \le \log_b(2)$$

Conclusion

The math proves that JSD is beautifully bounded. If you are calculating it in bits (base 2), the maximum divergence is exactly $\log_2(2) = 1$. If you are calculating it in nats (base $e$), the maximum divergence is exactly $\ln(2) \approx 0.693$.

This hard upper limit is why JSD is often preferred over standard KL Divergence when you need a stable, normalized metric for machine learning models (like in Generative Adversarial Networks, or GANs)!