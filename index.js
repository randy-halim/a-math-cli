/*
    AP INFORMATION:
        AP ID: 0X8UV3ZZ
        INITIALS: RMH
    
    CREDITS:
        Prompts v2.3.2: NodeJS package to build prompts
            Author: https://github.com/terkelg
            Link: https://yarnpkg.com/package/prompts
        Chalk v4.0.0: NodeJS package to stylize the terminal
            Author: https://github.com/chalk
            Link: https://yarnpkg.com/package/chalk
        Yarn v1.22.4: NodeJS package dependacy manager
            Author: https://github.com/yarnpkg
            Link: https://yarnpkg.com
        NodeJS v12.16.3: JavaScript runtime based on Chrome v8 Engine
            Link: https://nodejs.org/en/
*/

console.clear();

const prompts = require('prompts'); // NodeJS Prompts package
const chalk = require('chalk'); // NodeJS Chalk package

let questionNumber = 0;
let lives = 5;
let extraLifeThres = 100;
let score = 0;

let config;

let randomSeed = {
    x: 0,
    y: 0
};

const log = console.log;
const redLog = (x) => log(chalk.bold.redBright(x));
const greenLog = (x) => log(chalk.bold.greenBright(x));
const yellowLog = (x) => log(chalk.bold.yellow(x));

const generateRandomNumber = (min, max) => {
    let random = Math.random();
    random *= max;
    if (random < min) { random += min };
    random = Math.round(random);
    return random;
}

const generateMathEquation = (x, y) => {
    let ans;
    const operation = config.operations[generateRandomNumber(0, config.operations.length - 1)];
    switch (operation) {
        case 'add':
            ans = x + y;
            return {
                ans: ans,
                question: `${x} + ${y}`
            };
        case 'subtract':
            ans = x - y;
            return {
                ans: ans,
                question: `${x} - ${y}`
            }
        case 'multiply':
            x -= 5;
            y -= 5;
            ans = x * y;
            return {
                ans: ans,
                question: `${x} x ${y}`
            }
        case 'divide':
            while (y % x !== 0) {
                x = generateRandomNumber(randomSeed.x, randomSeed.y);
                y = generateRandomNumber(randomSeed.x, randomSeed.y);
            }
            ans = y / x;
            return {
                ans: ans,
                question: `${y} / ${x}`
            }
        default:
            console.error(`i don't know what ${operation} is...`);
            process.exit(1);
            return {
                ans: 'ERROR',
                question: 'ERROR'
            }
    }
};

const askQuestion = async () => {
    let question = generateMathEquation(generateRandomNumber(randomSeed.x, randomSeed.y), generateRandomNumber(randomSeed.x, randomSeed.y));
    questionNumber++;
    yellowLog(`you are on question ${questionNumber} \nand you have ${score} points with ${lives} lives remaining.`);
    const res = await prompts([
        {
            type: 'number',
            name: 'userAnswer',
            message: `what is ${question.question}?`,
        }
    ]);
    if (res.userAnswer === question.ans) {
        console.clear();
        greenLog('that\'s the right answer! \n+5 points \n\n');
        score += 10;
    }
    else {
        console.clear();
        redLog(`that\'s not the right answer... ${question.question} = ${question.ans} \n-5 points \n-1 life \n`);
        score -= 5;
        lives--;
    }
    return true;
};

const initial = async () => {
    if (questionNumber === 0) {
        config = await prompts([
            {
            type: 'select',
            name: 'difficulty',
            message: 'choose a difficulty',
            choices: [
                {
                    title: 'super easy',
                    description: 'kindergarden mode!',
                    value: 1
                },
                {
                    title: 'easy',
                    value: 2
                },
                {
                    title: 'medium',
                    description: 'reccomended',
                    value: 3
                },
                {
                    title: 'hard',
                    value: 4
                },
                {
                    title: 'super hard',
                    description: 'note: haven\'t tested this out yet...',
                    value: 5
                }
            ],
            initial: 2,
        },
        {
            type: (prev) => prev === 0 ? false : 'multiselect',
            name: 'operations',
            message: 'choose operations you want to be tested on',
            choices: [
                {
                    title: 'addition (+)',
                    value: 'add',
                    selected: true
                },
                {
                    title: 'subtraction (-)',
                    value: 'subtract'
                },
                {
                    title: 'multiplication (x)',
                    value: 'multiply'
                },
                {
                    title: 'division (/)',
                    value: 'divide'
                }
            ]
        }
        ]).then((res) => {
            console.clear();
            if (res.operations.length === 0) {
                console.error('no operations! exiting with code 1');
                process.exit(1);
            }
            return res;
        });
    }
};

const rerollRange = () => {
    switch (config.difficulty) {
        case 1:
            // super easy
            randomSeed.x = generateRandomNumber(0, 5);
            randomSeed.y = generateRandomNumber(6, 10);
            break;
        case 2:
            // easy
            randomSeed.x = generateRandomNumber(0, 10);
            randomSeed.y = generateRandomNumber(11, 20);
            break;
        case 3:
            // medium
            randomSeed.x = generateRandomNumber(0, 15);
            randomSeed.y = generateRandomNumber(16, 30);
            break;
        case 4:
            // hard
            randomSeed.x = generateRandomNumber(0, 20);
            randomSeed.y = generateRandomNumber(21, 40);
            break;
        case 5:
            // super hard
            randomSeed.x = generateRandomNumber(0, 25);
            randomSeed.y = generateRandomNumber(26, 50);
            break;
        default:
            // uhh...
            console.error('nope, idk what happened.');
            process.exit(1);
    }
}

const body = async () => {
    await initial();
    if (score < 0) {
        score = 0;
    }
    if (lives === 0) {
        console.clear();
        yellowLog(`you ran out of lives! game over\n
        you answered ${questionNumber} questions\n
        and got a total of ${score} points.
        `)
        return null;
    }
    if (score >= extraLifeThres) {
        lives++;
        extraLifeThres += 100;
        greenLog(`you got an extra life! now you have ${lives} lives. \n+1 life \n`);
    }
    const wait = await askQuestion();
    body();
};

body();