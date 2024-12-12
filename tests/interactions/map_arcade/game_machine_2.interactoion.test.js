import { interactionWithGameMachine2 } from '../../../src/interactions/map_arcade/game_machine_2.interactions.js';
import { displayDialogue } from '../../../src/utils';
import {interactionWithGameMachine7} from "../../../src/interactions/map_arcade/game_machine_7.interaction.js";

jest.mock('../../../src/utils', () => ({
    displayDialogue: jest.fn(),
}));

describe('interactionWithGameMachine2', () => {
    let player;
    let k;
    let map;

    beforeEach(() => {
        player = {
            onCollide: jest.fn(),
        };
        k = {
            debug: {
                log: jest.fn(),
            },
            go: jest.fn(),
            scene: jest.fn(),
            loadSprite: jest.fn(),
            add: jest.fn(),
            setGravity: jest.fn(),
            wait: jest.fn((_, cb) => cb()),
            loop: jest.fn((_, cb) => cb()),
            onKeyPress: jest.fn(),
        };
        map = {};
        document.body.innerHTML = `
            <div id="prompt-message"></div>
            <div id="options-container"></div>
            <div id="custom-prompt"></div>
        `;
    });

    test('player triggers interaction with game machine', () => {
        interactionWithGameMachine2(player, k, map);

        expect(player.onCollide).toHaveBeenCalledWith('game_machine_2', expect.any(Function));

        const handler = player.onCollide.mock.calls[0][1];
        handler();

        expect(document.getElementById('prompt-message').textContent).toBe('Do you want to play the Word Guessing Game?');
    });

    test('selecting Yes starts the game', () => {
        const mockDisplayDialogue = displayDialogue;

        const logMock = jest.fn();
        k.debug.log = logMock;

        interactionWithGameMachine2(player, k, map);

        const handler = player.onCollide.mock.calls[0][1];
        handler();

        const optionButton = document.createElement('button');
        optionButton.onclick = jest.fn(() => {
            mockDisplayDialogue({ text: ['Starting the Word Guessing Game... Good luck!'] });
            k.debug.log('Game Word Guessing started!');
        });

        optionButton.onclick();

        expect(mockDisplayDialogue).toHaveBeenCalledWith(
            expect.objectContaining({ text: ['Starting the Word Guessing Game... Good luck!'] })
        );

        expect(logMock).toHaveBeenCalledWith('Game Word Guessing started!');
    });

    test('selecting No does not start the game', () => {
        const mockDisplayDialogue = displayDialogue;

        interactionWithGameMachine2(player, k, map);

        const handler = player.onCollide.mock.calls[0][1];
        handler();
        const optionButton = document.createElement('button');
        optionButton.onclick = jest.fn(() => {
            mockDisplayDialogue({ text: ['Maybe next time!'] });
        });
        optionButton.onclick();

        expect(mockDisplayDialogue).toHaveBeenCalledWith(
            expect.objectContaining({ text: ['Maybe next time!'] })
        );
    });
});
