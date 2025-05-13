// Default AutoRAG configuration parameters
// See: rewrite_query, max_num_results, ranking_options, score_threshold, stream
// Optional params (commented out): model, filters

/**
 * AutoRAG Config Defaults
 * @type {{
 *   rewrite_query: boolean,
 *   max_num_results: number,
 *   ranking_options: { score_threshold: number },
 *   stream: boolean,
 *   // model?: string,
 *   // filters?: object
 * }}
 */
export const autoragConfig = {
  // Rewrites the original query into a search-optimized form. Defaults to false.
  rewrite_query: true,
  // Max number of results to return. Defaults to 10. Must be 1–50.
  max_num_results: 20,
  // Ranking options for filtering by match score.
  ranking_options: {
    // Minimum match score for inclusion. Defaults to 0. Must be 0–1.
    score_threshold: 0.4
  },
  // Stream results as they are available. Defaults to false.
  stream: false,
  // model: '@cf/meta/llama-3.3-70b-instruct-sd',
  // filters: {}
};
