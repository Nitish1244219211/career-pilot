import { z } from 'zod';

/**
 * POST /api/resumes
 */
export const createResumeSchema = z.object({
  originalText: z
    .string({ required_error: 'originalText is required' })
    .min(1, 'originalText cannot be empty'),
  enhancedText: z.string().nullish(),
  jobRole: z.string().nullish(),
  preferences: z.record(z.unknown()).optional().default({}),
  title: z.string().max(200, 'title must be at most 200 characters').optional(),
});

/**
 * PUT /api/resumes/:resumeId
 */
export const updateResumeSchema = z
  .object({
    originalText: z.string().min(1, 'originalText cannot be empty').optional(),
    enhancedText: z.string().nullish(),
    jobRole: z.string().nullish(),
    preferences: z.record(z.unknown()).optional(),
    title: z.string().max(200, 'title must be at most 200 characters').optional(),
    pdfUrl: z.string().url('pdfUrl must be a valid URL').nullish(),
  })
  .refine(
    (data) => Object.values(data).some((v) => v !== undefined),
    { message: 'At least one field must be provided for update' }
  );

/**
 * GET /api/resumes/:resumeId/download  (query params)
 */
export const downloadResumeQuerySchema = z.object({
  version: z.enum(['enhanced', 'original']).optional().default('enhanced'),
});

/**
 * POST /api/resumes/:resumeId/versions
 */
export const createResumeVersionSchema = z.object({
  title: z.string().max(200, 'title must be at most 200 characters').optional(),
  originalText: z.string().min(1, 'originalText cannot be empty'),
  enhancedText: z.string().nullish(),
  jobRole: z.string().nullish(),
  atsScore: z.number().min(0).max(100).optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.unknown()).optional().default({}),
});

/**
 * PUT /api/resumes/:resumeId/versions/:versionId
 */
export const updateResumeVersionSchema = z.object({
  title: z.string().max(200, 'title must be at most 200 characters').optional(),
  tags: z.array(z.string()).optional(),
  jobRole: z.string().nullish(),
});

/**
 * POST /api/resumes/:resumeId/ats-history
 */
export const createAtsHistorySchema = z.object({
  jobRole: z.string({ required_error: 'jobRole is required' }).min(1, 'jobRole cannot be empty'),
  atsScore: z.number().min(0).max(100),
  scoreBreakdown: z.object({
    keywordMatch: z.number().default(0),
    formatting: z.number().default(0),
    experienceRelevance: z.number().default(0),
    skillsAlignment: z.number().default(0),
    educationMatch: z.number().default(0)
  }).optional(),
  missingKeywords: z.array(z.string()).optional(),
  improvementsCount: z.number().optional()
});

