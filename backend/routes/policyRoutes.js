const express = require('express');
const router = express.Router();
const {
  getPolicies,
  getPolicyById,
  createPolicy,
  updatePolicy,
  deletePolicy,
  simplifyPolicy,
} = require('../controllers/policyController');
const { comparePolicies, generateFAQs } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.get('/', getPolicies);
router.get('/:id', getPolicyById);
router.post('/', protect, admin, createPolicy);
router.put('/:id', protect, admin, updatePolicy);
router.delete('/:id', protect, admin, deletePolicy);
router.post('/:id/simplify', protect, simplifyPolicy);
router.post('/compare', protect, comparePolicies);
router.post('/:id/faq', protect, generateFAQs);

module.exports = router;
