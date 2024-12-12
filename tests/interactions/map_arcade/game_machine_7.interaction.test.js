import { interactionWithGameMachine7 } from '../../../src/interactions/map_arcade/game_machine_7.interaction.js';
import { displayDialogue } from '../../../src/utils';

jest.mock('../../../src/utils', () => ({
    displayDialogue: jest.fn(),
}));

describe('interactionWithGameMachine7', () => {
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
        interactionWithGameMachine7(player, k, map);

        expect(player.onCollide).toHaveBeenCalledWith('game_machine_7', expect.any(Function));

        const handler = player.onCollide.mock.calls[0][1];
        handler();

        expect(document.getElementById('prompt-message').textContent).toBe('Do you want to play the Jumper Game?');
    });

    test('selecting Yes starts the game', () => {
        const mockDisplayDialogue = displayDialogue;

        const logMock = jest.fn();
        k.debug.log = logMock;

        interactionWithGameMachine7(player, k, map);

        const handler = player.onCollide.mock.calls[0][1];
        handler();

        const optionButton = document.createElement('button');
        optionButton.onclick = jest.fn(() => {
            mockDisplayDialogue({ text: ['Starting the Jumper Game... Get ready!!'] });
            k.debug.log('Game Jump Quest started!');
        });

        optionButton.onclick();

        expect(mockDisplayDialogue).toHaveBeenCalledWith(
            expect.objectContaining({ text: ['Starting the Jumper Game... Get ready!!'] })
        );

        expect(logMock).toHaveBeenCalledWith('Game Jump Quest started!');
    });

    test('selecting No does not start the game', () => {
        const mockDisplayDialogue = displayDialogue;

        interactionWithGameMachine7(player, k, map);

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

    test('player collision with obstacle ends the game', () => {
        const goMock = jest.fn();
        k.go = goMock;

        interactionWithGameMachine7(player, k, map);

        const playerInstance = {
            onCollide: jest.fn(),
        };

        playerInstance.onCollide('obstacle', () => {
            k.go('lose', {
                title: 'Jump Quest',
                score: 0,
            });
        });

        const handler = playerInstance.onCollide.mock.calls[0][1];
        handler();

        expect(goMock).toHaveBeenCalledWith('lose', expect.objectContaining({
            title: 'Jump Quest',
            score: 0,
        }));
    });

    test('player collision with immunity token grants immunity', () => {
        const playerInstance = {
            onCollide: jest.fn(),
            opacity: 1,
        };

        interactionWithGameMachine7(player, k, map);

        playerInstance.onCollide('immunityToken', () => {
            playerInstance.opacity = 0.5;  // Simulate immunity effect
        });

        const handler = playerInstance.onCollide.mock.calls[0][1];
        handler();

        expect(playerInstance.opacity).toBe(0.5);
    });

});
