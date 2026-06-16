// Page Content CMS — editable content for dynamic pages
// GET/PUT /api/pages/:pageId — reads/writes JSONB in page_content table

const express = require('express')
const router = express.Router()
const pool = require('../db.cjs')

// ─── GET page content ────────────────────────────────────────────────
router.get('/:pageId', async (req, res) => {
  try {
    const { pageId } = req.params
    const { rows } = await pool.query(
      'SELECT content, updated_at FROM page_content WHERE page_id = $1',
      [pageId]
    )
    if (rows.length === 0) {
      return res.json({ content: null, updated_at: null })
    }
    res.json({
      content: rows[0].content,
      updated_at: rows[0].updated_at,
    })
  } catch (err) {
    console.error(`GET /api/pages/${req.params.pageId} error:`, err.message)
    res.status(500).json({ error: err.message })
  }
})

// ─── UPDATE page content ─────────────────────────────────────────────
router.put('/:pageId', async (req, res) => {
  try {
    const { pageId } = req.params
    const { content } = req.body

    if (!content || typeof content !== 'object') {
      return res.status(400).json({ error: 'Content must be a JSON object' })
    }

    const { rows } = await pool.query(
      `INSERT INTO page_content (page_id, content, updated_at)
       VALUES ($1, $2::jsonb, NOW())
       ON CONFLICT (page_id) DO UPDATE SET
         content = EXCLUDED.content,
         updated_at = NOW()
       RETURNING content, updated_at`,
      [pageId, JSON.stringify(content)]
    )

    console.log(`📝 Page content updated: ${pageId}`)
    res.json({
      content: rows[0].content,
      updated_at: rows[0].updated_at,
    })
  } catch (err) {
    console.error(`PUT /api/pages/${req.params.pageId} error:`, err.message)
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
