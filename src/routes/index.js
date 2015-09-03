import express from 'express';
import { auth } from './auth';
import { clan } from './clan';
import { user } from './user';

console.log('ROUTES IMPORTED');
let router = express.Router();


router.post('/login', auth.tokensignin);

// Create a new clan.
router.post('/api/v1/clan', clan.createClan);
// Create a user.
router.post('/api/v1/user', user.createUser);

// Returns user profile
router.get('/api/v1/user/:userID', user.profile);
// Update user profile
router.put('/api/v1/user/:userID', user.update);
// Toggle user war status
router.get('/api/v1/user/:userID/toggleWar', user.toggleWar);
// Add player into war
router.get('/api/v1/user/:userID/inWar', user.addToWar);
// Move player out of war
router.get('/api/v1/user/:userID/outWar', user.outOfWar);

// Returns clan details (Name, id, number of members, etc).
router.get('/api/v1/clan/:clanID', clan.clanDetails);
// Returns clan members list.
router.get('/api/v1/clan/:clanID/members', user.getUsersInClan);
// Returns clan war ready members list.
router.get('/api/v1/clan/:clanID/war/ready', clan.warReadyMembers);
// Returns clan war participant members list.
router.get('/api/v1/clan/:clanID/war/members', clan.warMembers);

// Join clan
router.put('/api/v1/clan/:clanID/join', user.joinClan);
// Leave clan
router.put('/api/v1/clan/:clanID/leave', user.leaveClan);

// Update clan details
router.put('/api/v1/clan/:clanID', clan.clanDetailsUpdate);
// Update clan members (change war status, add new members). - OUTDATED
router.put('/api/v1/clan/:clanID/members/update', clan.clanMembersUpdate);
// Update clan war members (add and remove participants). - OUTDATED
router.put('/api/v1/clan/:clanID/war/members/update', clan.warMembersUpdate);

router.put('/api/v1/user/:userID/war')
// Update clan warmap list.
router.put('/api/v1/clan/:clanID/warmap/update', clan.warMapUpdate);

// Reset/empty war memebrs list.
router.get('/api/v1/clan/:clanID/war/members/reset', clan.warMembersReset);
// Toggles clan war status.
router.get('/api/v1/clan/:clanID/war/toggle', clan.warStatusToggle);

export { router };
