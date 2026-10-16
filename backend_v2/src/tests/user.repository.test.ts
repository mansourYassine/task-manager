import { jest } from "@jest/globals";

const mockExecute = jest.fn<(...args: unknown[]) => Promise<unknown>>();

jest.unstable_mockModule("../config/db.js", () => ({
    pool: { execute: mockExecute },
}));

const { isTokenExists } = await import("../repositories/user.repository.js");

describe('isTokenExists', () => {
    it('Should return true if the hashed refresh token exists in the database', async () => {
        mockExecute.mockResolvedValueOnce([[{ isExist: 1 }], []]);

        await expect(isTokenExists("07737ccbde2583a24f30f3804a70048c2a3b822336a8c4fad152b2c81a33a16")).resolves.toBe(true);
    });

    it('Should return false if the hashed refresh token does not exist in the database', async () => {
        mockExecute.mockResolvedValueOnce([[{ isExist: 0 }], []]);

        await expect(isTokenExists("07737ccbde2583a24f30f3804a70048c2a3b822336a8c4fad152b2c81a33a16")).resolves.toBe(false);
    });
});