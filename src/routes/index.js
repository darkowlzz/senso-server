import express from 'express';

let router = express.Router();

let auth = require('./auth.js'),
    db = require('./db.js'),
    user = require('./users.js');

router.post('/login', auth.login);

// Create a new clan.
router.post('/api/v1/clan', db.createClan);
// Create a user.
router.post('/api/v1/user', user.createUser);

// Returns clan details (Name, id, number of members, etc).
router.get('/api/v1/clan/:clanID', db.clanDetails);
// Returns clan members list.
router.get('/api/v1/clan/:clanID/members', db.clanMembers);
// Returns clan war ready members list.
router.get('/api/v1/clan/:clanID/war/ready', db.warReadyMembers);
// Returns clan war participant members list.
router.get('/api/v1/clan/:clanID/war/members', db.warMembers);

// Update clan details
router.put('/api/v1/clan/:clanID', db.clanDetailsUpdate);
// Update clan members (change war status, add new members).
router.put('/api/v1/clan/:clanID/members/update', db.clanMembersUpdate);
// Update clan war members (add and remove participants).
router.put('/api/v1/clan/:clanID/war/members/update', db.warMembersUpdate);
// Update clan warmap list.
router.put('/api/v1/clan/:clanID/warmap/update', db.warMapUpdate);

// Reset/empty war memebrs list.
router.get('/api/v1/clan/:clanID/war/members/reset', db.warMembersReset);
// Toggles clan war status.
router.get('/api/v1/clan/:clanID/war/toggle', db.warStatusToggle);

export { router };
