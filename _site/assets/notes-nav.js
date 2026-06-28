/**
 * notes-nav.js — Prev/Next navigation card for all notes pages.
 *
 * Defines the global ordered list of all notes across every subject.
 * The order within each subject mirrors the subject landing page.
 */

(function () {
  "use strict";

  // ── Global note registry ────────────────────────────────────────────────
  // Each entry: { section, subject, title, href }
  // 'href' is the path relative to the site root.
  // 'section' is the human-readable heading within the subject landing page.
  // The order here defines the Prev/Next sequencing.

  const ALL_NOTES = [

    // ── Linear Algebra ──────────────────────────────────────────────────
    { section: "Foundations", subject: "Linear Algebra", title: "Vector Basics", href: "/notes/linear-algebra/vector-basics.html" },
    { section: "Foundations", subject: "Linear Algebra", title: "Vector Space", href: "/notes/linear-algebra/vector-space.html" },
    { section: "Foundations", subject: "Linear Algebra", title: "Summation and Scalar Multiplication", href: "/notes/linear-algebra/summation-and-scalar-multiplication.html" },
    { section: "Matrix Operations", subject: "Linear Algebra", title: "Matrix Representation", href: "/notes/linear-algebra/matrix-representation.html" },
    { section: "Matrix Operations", subject: "Linear Algebra", title: "Matrix Vector Multiplication", href: "/notes/linear-algebra/matrix-vector-multiplication-two-views.html" },
    { section: "Matrix Operations", subject: "Linear Algebra", title: "Matrix Multiplication", href: "/notes/linear-algebra/matrix-multiplication-four-views.html" },
    { section: "Matrix Operations", subject: "Linear Algebra", title: "Matrix Inverse", href: "/notes/linear-algebra/matrix-inverse.html" },
    { section: "Matrix Operations", subject: "Linear Algebra", title: "Transpose", href: "/notes/linear-algebra/transpose.html" },
    { section: "Matrix Operations", subject: "Linear Algebra", title: "Diagonal Matrices", href: "/notes/linear-algebra/diagonal-matrices.html" },
    { section: "Matrix Operations", subject: "Linear Algebra", title: "Block Matrix Decompositions", href: "/notes/linear-algebra/block-matrix-decompositions.html" },
    { section: "Matrix Operations", subject: "Linear Algebra", title: "Matrix Partitioning", href: "/notes/linear-algebra/matrix-partitioning.html" },
    { section: "Matrix Operations", subject: "Linear Algebra", title: "Hadamard Product", href: "/notes/linear-algebra/hadamard-product.html" },
    { section: "Matrix Operations", subject: "Linear Algebra", title: "Kronecker Product", href: "/notes/linear-algebra/kronecker-product.html" },
    { section: "Matrix Operations", subject: "Linear Algebra", title: "Matrix Norms", href: "/notes/linear-algebra/matrix-norms.html" },
    { section: "Subspaces", subject: "Linear Algebra", title: "Linear Independence and Rank", href: "/notes/linear-algebra/linear-independence-and-rank.html" },
    { section: "Subspaces", subject: "Linear Algebra", title: "Four Fundamental Subspaces", href: "/notes/linear-algebra/four-fundamental-subspaces.html" },
    { section: "Subspaces", subject: "Linear Algebra", title: "Rank-Nullity Theorem", href: "/notes/linear-algebra/rank-nullity-theorem.html" },
    { section: "Subspaces", subject: "Linear Algebra", title: "Dimensions and Orthogonality", href: "/notes/linear-algebra/dimensions-and-orthogonality-of-four-fundamental-subspaces.html" },
    { section: "Inner Products", subject: "Linear Algebra", title: "Hilbert Space", href: "/notes/linear-algebra/hilbert-space.html" },
    { section: "Inner Products", subject: "Linear Algebra", title: "Banach Space", href: "/notes/linear-algebra/banach-space.html" },
    { section: "Inner Products", subject: "Linear Algebra", title: "Gram Matrices", href: "/notes/linear-algebra/gram-matrices.html" },
    { section: "Orthogonality", subject: "Linear Algebra", title: "Square Orthonormal Matrices", href: "/notes/linear-algebra/square-orthonormal-matrices.html" },
    { section: "Orthogonality", subject: "Linear Algebra", title: "General Properties of Orthonormal Matrices", href: "/notes/linear-algebra/general-properties-of-orthonormal-matrices.html" },
    { section: "Orthogonality", subject: "Linear Algebra", title: "Projection Matrix", href: "/notes/linear-algebra/projection-matrix.html" },
    { section: "Orthogonality", subject: "Linear Algebra", title: "Gram-Schmidt Algorithm", href: "/notes/linear-algebra/gram-schmidt-algorithm.html" },
    { section: "Eigenstructure", subject: "Linear Algebra", title: "Eigenvalues and Eigenvectors", href: "/notes/linear-algebra/eigenvalues-and-eigenvectors.html" },
    { section: "Eigenstructure", subject: "Linear Algebra", title: "Spectral Decomposition", href: "/notes/linear-algebra/spectral-decomposition.html" },
    { section: "Eigenstructure", subject: "Linear Algebra", title: "Symmetric Matrix", href: "/notes/linear-algebra/symmetric-matrix.html" },
    { section: "Eigenstructure", subject: "Linear Algebra", title: "Rayleigh Quotient", href: "/notes/linear-algebra/rayleigh-quotient.html" },
    { section: "Eigenstructure", subject: "Linear Algebra", title: "Power Method", href: "/notes/linear-algebra/power-method.html" },
    { section: "Eigenstructure", subject: "Linear Algebra", title: "Singular Values and Singular Vectors", href: "/notes/linear-algebra/singular-values-and-singular-vectors.html" },
    { section: "Advanced Topics", subject: "Linear Algebra", title: "Change of Basis", href: "/notes/linear-algebra/change-of-basis.html" },
    { section: "Advanced Topics", subject: "Linear Algebra", title: "Geometric Transformation and Matrix", href: "/notes/linear-algebra/geometric-transformation-and-matrix.html" },
    { section: "Advanced Topics", subject: "Linear Algebra", title: "Geometric and Computational Interpretations", href: "/notes/linear-algebra/geometric-and-computational-interpretations.html" },
    { section: "Advanced Topics", subject: "Linear Algebra", title: "Complex Numbers and Rotations", href: "/notes/linear-algebra/complex-numbers-and-rotations.html" },
    { section: "Advanced Topics", subject: "Linear Algebra", title: "Quadratic Forms and Definiteness", href: "/notes/linear-algebra/quadratic-forms-and-definiteness.html" },
    { section: "Advanced Topics", subject: "Linear Algebra", title: "Matrix Functions", href: "/notes/linear-algebra/matrix-functions.html" },
    { section: "Applications", subject: "Linear Algebra", title: "From Spectral Methods to Graph Neural Networks", href: "/notes/linear-algebra/from-spectral-methods-to-graph-neural-networks.html" },
    { section: "Applications", subject: "Linear Algebra", title: "Applications in AI and Optimization", href: "/notes/linear-algebra/applications-in-ai-and-optimization.html" },

    // ── Information Theory ───────────────────────────────────────────────
    { section: "Core Information Measures", subject: "Information Theory", title: "Information Content", href: "/notes/information-theory/information-content.html" },
    { section: "Core Information Measures", subject: "Information Theory", title: "Entropy", href: "/notes/information-theory/entropy.html" },
    { section: "Core Information Measures", subject: "Information Theory", title: "Mutual Information", href: "/notes/information-theory/mutual-information.html" },
    { section: "Core Information Measures", subject: "Information Theory", title: "Cross-Entropy", href: "/notes/information-theory/cross-entropy.html" },
    { section: "Core Information Measures", subject: "Information Theory", title: "Perplexity", href: "/notes/information-theory/perplexity.html" },
    { section: "Divergences and Distances", subject: "Information Theory", title: "KL Divergence", href: "/notes/information-theory/kl-divergence.html" },
    { section: "Divergences and Distances", subject: "Information Theory", title: "Jensen-Shannon Divergence", href: "/notes/information-theory/jensen-shannon-divergence.html" },
    { section: "Divergences and Distances", subject: "Information Theory", title: "f-Divergence", href: "/notes/information-theory/f-divergence.html" },
    { section: "Divergences and Distances", subject: "Information Theory", title: "Wasserstein Distance", href: "/notes/information-theory/wasserstein-distance.html" },
    { section: "Statistical Information", subject: "Information Theory", title: "Fisher Information", href: "/notes/information-theory/fisher-information.html" },
    { section: "Variational Objectives", subject: "Information Theory", title: "Evidence Lower Bound (ELBO)", href: "/notes/information-theory/evidence-lower-bound-elbo.html" },
    { section: "Markov Information Processes", subject: "Information Theory", title: "Markov Chain", href: "/notes/information-theory/markov-chain.html" },
    { section: "Markov Information Processes", subject: "Information Theory", title: "Stochastic Matrices and Markov Chains", href: "/notes/information-theory/stochastic-matrices-and-markov-chains.html" },
    { section: "Information-Theoretic Learning", subject: "Information Theory", title: "Information Bottleneck", href: "/notes/information-theory/information-bottleneck.html" },
    { section: "Information-Theoretic Learning", subject: "Information Theory", title: "Evaluation Metrics for Ranking", href: "/notes/information-theory/evaluation-metrics-for-ranking-and-information-retrieval.html" },

    // ── Matrix Calculus ─────────────────────────────────────────────────
    { section: "Foundations", subject: "Matrix Calculus", title: "Single Variable Derivative", href: "/notes/matrix-calculus/single-variable-derivative.html" },
    { section: "Foundations", subject: "Matrix Calculus", title: "Scalar and Vector Fields", href: "/notes/matrix-calculus/scalar-and-vector-fields.html" },
    { section: "Foundations", subject: "Matrix Calculus", title: "Partial Differentiation and Gradients", href: "/notes/matrix-calculus/partial-differentiation-and-gradients.html" },
    { section: "Foundations", subject: "Matrix Calculus", title: "Unified View of Derivatives", href: "/notes/matrix-calculus/unified-view-of-derivatives.html" },
    { section: "Advanced Tools", subject: "Matrix Calculus", title: "Jacobian Matrix", href: "/notes/matrix-calculus/jacobian-matrix.html" },
    { section: "Advanced Tools", subject: "Matrix Calculus", title: "Hessian Matrix", href: "/notes/matrix-calculus/hessian-matrix.html" },
    { section: "Advanced Tools", subject: "Matrix Calculus", title: "Fréchet Derivative", href: "/notes/matrix-calculus/fréchet-derivative.html" },
    { section: "Advanced Tools", subject: "Matrix Calculus", title: "Taylor Expansion", href: "/notes/matrix-calculus/taylor-expansion.html" },
    { section: "Advanced Tools", subject: "Matrix Calculus", title: "Non-Differentiable Operations in Chain Rule", href: "/notes/matrix-calculus/non-differentiable-operations-in-chain-rule.html" },
    { section: "Conceptual Hierarchy", subject: "Matrix Calculus", title: "Calculus Conceptual Hierarchy", href: "/notes/matrix-calculus/calculus-conceptual-hierarchy.html" },
  ];

  // ── Find the current page in the list ──────────────────────────────────
  function normalizePath(p) {
    // Strip trailing slash, make case-consistent
    return p.replace(/\/$/, "").toLowerCase();
  }

  const currentPath = normalizePath(window.location.pathname);
  const currentIndex = ALL_NOTES.findIndex(function (n) {
    return normalizePath(n.href) === currentPath;
  });

  // Not a tracked notes page — bail silently
  if (currentIndex === -1) return;

  const prev = currentIndex > 0 ? ALL_NOTES[currentIndex - 1] : null;
  const next = currentIndex < ALL_NOTES.length - 1 ? ALL_NOTES[currentIndex + 1] : null;
  const current = ALL_NOTES[currentIndex];

  // ── Build the card HTML ────────────────────────────────────────────────
  function makeSectionLabel(neighbor) {
    if (!neighbor) return "";
    if (neighbor.section !== current.section || neighbor.subject !== current.subject) {
      // Entering a new section or subject — show both
      var extra = neighbor.subject !== current.subject
        ? neighbor.subject + " › " + neighbor.section
        : neighbor.section;
      return '<span class="notes-nav-section">' + extra + '</span>';
    }
    return "";
  }

  function makeBtn(neighbor, dir) {
    if (!neighbor) return "";
    var isNext = dir === "next";
    var arrow = isNext ? "→" : "←";
    var labelText = isNext ? "Next" : "Previous";
    var sectionHtml = makeSectionLabel(neighbor);

    return (
      '<a href="' + neighbor.href + '" class="notes-nav-btn is-' + dir + '" aria-label="' + labelText + ': ' + neighbor.title + '">' +
        '<span class="notes-nav-arrow">' + arrow + "</span>" +
        '<span class="notes-nav-text">' +
          '<span class="notes-nav-label">' + labelText + "</span>" +
          sectionHtml +
          '<span class="notes-nav-title">' + neighbor.title + "</span>" +
        "</span>" +
      "</a>"
    );
  }

  // ── Inject after the main document card ───────────────────────────────
  function inject() {
    var docContent = document.getElementById("quarto-document-content");
    if (!docContent) return;

    var card = document.createElement("nav");
    card.className = "notes-nav-card";
    card.setAttribute("aria-label", "Notes navigation");
    card.innerHTML = makeBtn(prev, "prev") + makeBtn(next, "next");

    docContent.parentNode.insertBefore(card, docContent.nextSibling);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject);
  } else {
    inject();
  }
})();
