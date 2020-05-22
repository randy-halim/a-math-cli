console.clear();

const prompts = require('prompts');
const chalk = require('chalk');

let questionNumber = 0;
let lives = 5;
let extraLifeThres = 100;
let score = 0;

let config;

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
            ans = x * y;
            return {
                ans: ans,
                question: `${x} x ${y}`
            }
        case 'divide':
            ans = x / y;
            return {
                ans: ans,
                question: `${x} / ${y}`
            }
        default:
            console.error(`i don't know what ${operation} is...`);
            return {
                ans: 'ERROR',
                question: 'ERROR'
            }
    }
};

const askQuestion = async () => {
    let question = generateMathEquation(2, 5);
    questionNumber++;
    yellowLog(`you are on question ${questionNumber} \nand you have ${score} points with ${lives} lives remaining.`);
    const res = await prompts({
        type: 'number',
        name: 'userAnswer',
        message: `what is ${question.question}?`,
    });
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
                    value: 3
                },
                {
                    title: 'medium',
                    description: 'reccomended',
                    value: 5
                },
                {
                    title: 'hard',
                    value: 9
                },
                {
                    title: 'super hard',
                    description: 'note: haven\'t tested this out yet...',
                    value: 16
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