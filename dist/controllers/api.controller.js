"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUserToOrganisation = exports.createNewOrganisation = exports.getParticularUserOrganisation = exports.userOrganisationList = exports.userDetails = void 0;
const app_1 = require("../app");
//Get a User Detail
const userDetails = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;
    try {
        const user = await app_1.prisma.user.findUnique({
            where: { userId: userId },
            include: { organisations: true }
        });
        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'No User Found',
                statusCode: 404,
            });
        }
        // Check if the current user is the same as the requested user
        if (id === userId) {
            return res.status(200).json({
                status: 'success',
                message: 'User retrieved successfully',
                data: {
                    userId: user.userId,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone
                }
            });
        }
        // Check if both the current user and the requested user are in the same organisation
        const sameOrganization = await app_1.prisma.organisationUser.findFirst({
            where: {
                userId: id,
                organisation: {
                    users: {
                        some: { userId: userId }
                    }
                }
            }
        });
        if (sameOrganization) {
            return res.status(200).json({
                status: 'success',
                message: 'User retrieved successfully',
                data: {
                    userId: user.userId,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone
                }
            });
        }
        // If none of the conditions match
        return res.status(401).json({
            status: 'Bad request',
            message: 'Error occured, try again',
            statusCode: 401,
        });
    }
    catch (error) {
        res.status(401).json({
            status: 'Bad request',
            message: 'Error occured, try again',
            statusCode: 401,
        });
    }
};
exports.userDetails = userDetails;
//Get a User Organisation List
const userOrganisationList = async (req, res) => {
    const userId = req.user.userId;
    try {
        const organisations = await app_1.prisma.organisation.findMany({
            where: {
                users: {
                    some: { userId }
                }
            }
        });
        res.status(200).json({
            status: 'success',
            message: 'Organisations retrieved successfully',
            data: {
                organisations
            }
        });
    }
    catch (error) {
        res.status(401).json({
            status: 'Bad request',
            message: 'Error occured, try again',
            statusCode: 401,
        });
    }
};
exports.userOrganisationList = userOrganisationList;
//Get Only a particular Organization for the User
const getParticularUserOrganisation = async (req, res) => {
    const { orgId } = req.params;
    const userId = req.user.userId;
    try {
        // Find the organisation with the provided orgId that the user belongs to
        const organisation = await app_1.prisma.organisation.findFirst({
            where: {
                orgId,
                users: {
                    some: { userId }
                }
            }
        });
        if (!organisation) {
            return res.status(404).json({
                status: 'failed',
                message: 'Organisation not found',
                statusCode: 404,
            });
        }
        res.status(200).json({
            status: 'success',
            message: 'Organisation retrieved successfully',
            data: {
                "orgId": organisation.orgId,
                "name": organisation.name,
                "description": organisation.description,
            }
        });
    }
    catch (error) {
        res.status(401).json({
            status: 'Bad request',
            message: 'Error occured, try again',
            statusCode: 401,
        });
    }
};
exports.getParticularUserOrganisation = getParticularUserOrganisation;
//Create New Organisation for User
const createNewOrganisation = async (req, res) => {
    const { name, description } = req.body;
    const userId = req.user.userId;
    try {
        const organisation = await app_1.prisma.organisation.create({
            data: {
                name,
                description,
                users: {
                    create: {
                        userId
                    }
                }
            }
        });
        res.status(201).json({
            status: 'success',
            message: 'Organisation created successfully',
            data: organisation
        });
    }
    catch (error) {
        res.status(400).json({
            status: 'Bad request',
            message: 'Client error',
            statusCode: 400
        });
    }
};
exports.createNewOrganisation = createNewOrganisation;
//Add User to an Organization
const addUserToOrganisation = async (req, res) => {
    const { orgId } = req.params;
    const { userId } = req.body;
    try {
        //Check if Organisation exist
        const organisation = await app_1.prisma.organisation.findUnique({
            where: { orgId },
            include: {
                users: {
                    where: { userId }
                }
            }
        });
        if (!organisation) {
            return res.status(404).json({
                status: 'failed',
                message: 'Organisation not found',
                statusCode: 404,
            });
        }
        //Check if the user exists
        const user = await app_1.prisma.user.findUnique({
            where: { userId }
        });
        if (!user) {
            return res.status(404).json({
                status: 'failed',
                message: 'No User Found',
                statusCode: 404,
            });
        }
        // Add user to organisation
        await app_1.prisma.organisationUser.create({
            data: {
                userId,
                organisationId: orgId
            }
        });
        res.status(200).json({
            status: 'success',
            message: 'User added to organisation successfully'
        });
    }
    catch (error) {
        res.status(400).json({
            status: 'Bad request',
            message: 'Client error',
            statusCode: 400
        });
    }
};
exports.addUserToOrganisation = addUserToOrganisation;
//# sourceMappingURL=api.controller.js.map