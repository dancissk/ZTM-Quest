import { interactionWithGameMachine1 } from '../../../src/interactions/map_arcade/game_machine_1.interactions.js';
import { displayDialogue } from '../../../src/utils';

jest.mock('../../../src/utils', () => ({
    displayDialogue: jest.fn(),
}));
jest.mock('../../../src/utils/coinsUpdate', () => ({
    addCoins: jest.fn(),
}));

describe('interactionWithGameMachine1', () => {
    let player, k, map;

    beforeEach(() => {
        player = {
            onCollide: jest.fn(),
        };
        k = {
            debug: {
                log: jest.fn(),
            },
            go: jest.fn(),
            scene: jest.fn((name, handler) => {
                k.scene.mock.calls.push([name, handler]); // Capture the scene name and handler
            }),
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
        interactionWithGameMachine1(player, k, map);

        const handler = player.onCollide.mock.calls[0][1];
        handler(); // Trigger the interaction

        const promptMessage = document.getElementById('prompt-message');
        const optionsContainer = document.getElementById('options-container');
        const customPrompt = document.getElementById('custom-prompt');

        expect(promptMessage.textContent).toBe('Do you want to play the Number Guessing Game?');
        expect(customPrompt.style.display).toBe('flex');
        expect(optionsContainer.children.length).toBe(2);
    });

    test('selecting Yes starts the game', () => {
        const mockDisplayDialogue = displayDialogue;

        const logMock = jest.fn();
        k.debug.log = logMock;

        interactionWithGameMachine1(player, k, map);

        const handler = player.onCollide.mock.calls[0][1];
        handler();

        const optionButton = document.createElement('button');
        optionButton.onclick = jest.fn(() => {
            mockDisplayDialogue({ text: ['Starting the Number Guessing Game... Get ready!'] });
            k.debug.log('Game Number Guessing started!');
        });

        optionButton.onclick();

        expect(mockDisplayDialogue).toHaveBeenCalledWith(
            expect.objectContaining({ text: ['Starting the Number Guessing Game... Get ready!'] })
        );

        expect(logMock).toHaveBeenCalledWith('Game Number Guessing started!');
    });

    test('selecting No does not start the game', () => {
        interactionWithGameMachine1(player, k, map);

        const handler = player.onCollide.mock.calls[0][1];
        handler();

        const optionsContainer = document.getElementById('options-container');
        const noButton = optionsContainer.children[1];
        noButton.click();

        expect(displayDialogue).toHaveBeenCalledWith(
            expect.objectContaining({
                text: ['Maybe next time!'],
            })
        );
    });

});