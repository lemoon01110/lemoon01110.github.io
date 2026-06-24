import numpy as np
import matplotlib.pyplot as plt
from matplotlib.widgets import Slider
from scipy.spatial.distance import jensenshannon
import time
import matplotlib.animation as animation

# Initial parameters
mu1_init, var1_init = -2.0, 1.0
mu2_init, var2_init = 2.0, 1.0

# Define the x-axis for our continuous approximation
x = np.linspace(-20, 20, 1000)

def gaussian(x, mu, variance):
    """Returns the PDF of a normal distribution evaluated at x."""
    sigma = np.sqrt(variance)
    return np.exp(-0.5 * ((x - mu) / sigma)**2) / (sigma * np.sqrt(2 * np.pi))

# Set up the figure and two subplots
fig, (ax_dist, ax_js) = plt.subplots(2, 1, figsize=(10, 8))
plt.subplots_adjust(bottom=0.35, hspace=0.35)

# --- Top Plot: Distributions ---
p_line, = ax_dist.plot(x, gaussian(x, mu1_init, var1_init), label='P (Dist 1)', color='blue', lw=2)
q_line, = ax_dist.plot(x, gaussian(x, mu2_init, var2_init), label='Q (Dist 2)', color='orange', lw=2)
m_line, = ax_dist.plot(x, 0.5 * (gaussian(x, mu1_init, var1_init) + gaussian(x, mu2_init, var2_init)), 
                       label='M = (P+Q)/2', color='green', linestyle='--', lw=2)

ax_dist.set_title("Gaussian Distributions P, Q and Mixture M")
ax_dist.legend(loc="upper right")
ax_dist.set_xlim(-15, 15)
ax_dist.set_ylim(0, 1.0)
ax_dist.grid(True, alpha=0.3)
ax_dist.set_xlabel("x")
ax_dist.set_ylabel("Probability Density")

# --- Bottom Plot: JS Divergence vs Time ---
time_history = []
js_history = []
js_line, = ax_js.plot([], [], color='purple', lw=2, label='JS Divergence')

# The JS Divergence is bounded by ln(2)
ax_js.axhline(np.log(2), color='red', linestyle='--', label='Theoretical Bound (ln 2)')

ax_js.set_title("JS Divergence vs Time (Last 10 seconds)")
ax_js.set_xlim(-10, 0)
ax_js.set_ylim(0, np.log(2) * 1.1)
ax_js.set_xlabel("Time (s) relative to now")
ax_js.set_ylabel("JS Divergence (nats)")
ax_js.legend(loc="upper left")
ax_js.grid(True, alpha=0.3)

# --- Sliders ---
axcolor = 'lightgoldenrodyellow'
ax_mu1 = plt.axes([0.15, 0.22, 0.65, 0.03], facecolor=axcolor)
ax_var1 = plt.axes([0.15, 0.17, 0.65, 0.03], facecolor=axcolor)
ax_mu2 = plt.axes([0.15, 0.12, 0.65, 0.03], facecolor=axcolor)
ax_var2 = plt.axes([0.15, 0.07, 0.65, 0.03], facecolor=axcolor)

s_mu1 = Slider(ax_mu1, 'Mean P', -10.0, 10.0, valinit=mu1_init)
s_var1 = Slider(ax_var1, 'Variance P', 0.1, 15.0, valinit=var1_init)
s_mu2 = Slider(ax_mu2, 'Mean Q', -10.0, 10.0, valinit=mu2_init)
s_var2 = Slider(ax_var2, 'Variance Q', 0.1, 15.0, valinit=var2_init)

start_time = time.time()

def update(frame):
    """Animation update function to redraw the plots."""
    current_time = time.time() - start_time
    
    # Read slider values
    mu1 = s_mu1.val
    var1 = s_var1.val
    mu2 = s_mu2.val
    var2 = s_var2.val
    
    # Calculate PDFs
    P = gaussian(x, mu1, var1)
    Q = gaussian(x, mu2, var2)
    M = 0.5 * (P + Q)
    
    # Update distribution lines
    p_line.set_ydata(P)
    q_line.set_ydata(Q)
    m_line.set_ydata(M)
    
    # Calculate JS divergence
    # Normalize discrete P and Q for the scipy jensenshannon function
    P_norm = P / np.sum(P)
    Q_norm = Q / np.sum(Q)
    # jensenshannon returns square root of JS divergence by default
    js_val = jensenshannon(P_norm, Q_norm, base=np.e)**2
    
    # Update histories
    time_history.append(current_time)
    js_history.append(js_val)
    
    # Keep only the last 10 seconds of history
    while time_history and current_time - time_history[0] > 10:
        time_history.pop(0)
        js_history.pop(0)
        
    # Update JS divergence line
    rel_time = [t - current_time for t in time_history]
    js_line.set_data(rel_time, js_history)
    
    # Dynamically update the y-axis limit for the top plot
    max_density = max(np.max(P), np.max(Q))
    ax_dist.set_ylim(0, max_density * 1.1)
    
    return p_line, q_line, m_line, js_line

# Create animation loop updating every 50 ms
ani = animation.FuncAnimation(fig, update, interval=50, blit=False, save_count=100)

plt.show()
