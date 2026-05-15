const asyncHandler = require('express-async-handler');
const Policy = require('../models/Policy');
const { validatePolicy } = require('../utils/validators');
const { generateAIResponse } = require('../utils/openaiHelper');

// @desc    Get all policies
// @route   GET /api/policies
// @access  Public
const getPolicies = asyncHandler(async (req, res) => {
  const policies = await Policy.find({ isActive: true }).sort('-createdAt');
  res.json({
    success: true,
    data: policies,
  });
});

// @desc    Get policy by ID
// @route   GET /api/policies/:id
// @access  Public
const getPolicyById = asyncHandler(async (req, res) => {
  const policy = await Policy.findById(req.params.id);

  if (policy) {
    policy.views += 1;
    await policy.save();
    res.json({
      success: true,
      data: policy,
    });
  } else {
    res.status(404);
    throw new Error('Policy not found');
  }
});

// @desc    Create a policy
// @route   POST /api/policies
// @access  Private/Admin
const createPolicy = asyncHandler(async (req, res) => {
  const { error } = validatePolicy(req.body);
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  const policy = new Policy({
    ...req.body,
    createdBy: req.user._id,
  });

  const createdPolicy = await policy.save();
  res.status(201).json({
    success: true,
    data: createdPolicy,
  });
});

// @desc    Update a policy
// @route   PUT /api/policies/:id
// @access  Private/Admin
const updatePolicy = asyncHandler(async (req, res) => {
  const policy = await Policy.findById(req.params.id);

  if (policy) {
    Object.assign(policy, req.body);
    const updatedPolicy = await policy.save();
    res.json({
      success: true,
      data: updatedPolicy,
    });
  } else {
    res.status(404);
    throw new Error('Policy not found');
  }
});

// @desc    Delete a policy
// @route   DELETE /api/policies/:id
// @access  Private/Admin
const deletePolicy = asyncHandler(async (req, res) => {
  const policy = await Policy.findById(req.params.id);

  if (policy) {
    await policy.deleteOne();
    res.json({
      success: true,
      message: 'Policy removed',
    });
  } else {
    res.status(404);
    throw new Error('Policy not found');
  }
});

// @desc    Simplify policy with AI
// @route   POST /api/policies/:id/simplify
// @access  Private
const simplifyPolicy = asyncHandler(async (req, res) => {
  const policy = await Policy.findById(req.params.id);

  if (policy) {
    const prompt = `Simplify the following government policy content for an ordinary citizen: ${policy.content}`;
    const systemPrompt = "You are a Public Policy Explainer AI assistant. Break down complex legal text into simple, easy-to-understand language using bullet points.";
    
    const simplified = await generateAIResponse(prompt, systemPrompt, req.user.language || 'en');
    
    policy.simplifiedContent = simplified;
    await policy.save();

    res.json({
      success: true,
      data: simplified,
    });
  } else {
    res.status(404);
    throw new Error('Policy not found');
  }
});

module.exports = {
  getPolicies,
  getPolicyById,
  createPolicy,
  updatePolicy,
  deletePolicy,
  simplifyPolicy,
};
