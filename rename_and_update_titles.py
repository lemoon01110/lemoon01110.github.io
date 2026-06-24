import os
import re

dir_path = "/home/jackwu/Desktop/Repos/lemoon01110.github.io/notes/information-theory"

title_mapping = {
    "information-content.qmd": "Information Content",
    "entropy.qmd": "Entropy",
    "mutual-information.qmd": "Mutual Information",
    "cross-entropy.qmd": "Cross-Entropy",
    "perplexity.qmd": "Perplexity",
    "kl-divergence.qmd": "Kullback-Leibler Divergence",
    "js-divergence.qmd": "Jensen-Shannon Divergence",
    "f-divergence.qmd": "F-Divergence",
    "wasserstein-distance.qmd": "Wasserstein Distance",
    "fisher-information.qmd": "Fisher Information",
    "elbo.qmd": "Evidence Lower Bound (ELBO)",
    "markov-chain.qmd": "Markov Chain",
    "stochastic-matrices.qmd": "Stochastic Matrices & Markov Chains",
    "information-bottleneck.qmd": "Information Bottleneck",
    "ranking-ir-metrics.qmd": "Ranking & IR Metrics"
}

for filename in os.listdir(dir_path):
    if filename.startswith("14-") and filename.endswith(".qmd"):
        # Strip the "14-X-" part
        new_filename = re.sub(r'^14-\d+-', '', filename)
        
        old_path = os.path.join(dir_path, filename)
        new_path = os.path.join(dir_path, new_filename)
        
        with open(old_path, 'r') as f:
            content = f.read()
            
        if new_filename in title_mapping:
            new_title = title_mapping[new_filename]
            # Replace the title in the YAML frontmatter
            content = re.sub(r'title:\s*".*?"', f'title: "{new_title}"', content)
            
        with open(new_path, 'w') as f:
            f.write(content)
            
        os.remove(old_path)
        print(f"Renamed and updated {filename} -> {new_filename}")
