import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

function run(cmd) {
    console.log(`\x1b[36m> ${cmd}\x1b[0m`);
    try {
        return execSync(cmd, { stdio: 'inherit' });
    } catch (e) {
        console.error(`\x1b[31mFailed to execute command: ${cmd}\x1b[0m`);
        process.exit(1);
    }
}

// Read current version from package.json
const pkgPath = path.resolve('package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

// Determine target version
const currentVersion = pkg.version || '1.0.0';
const tagVersion = `v${currentVersion}`;

console.log(`\n\x1b[32m🚀 Starting Auto-Release for DesiFlix Version ${tagVersion}\x1b[0m\n`);

// 1. Stage all project files
run('git add .');

// 2. Commit changes if any exist
try {
    run(`git commit -m "release: ${tagVersion} - DesiFlix Android APK release"`);
} catch (e) {
    console.log('No new changes to commit, proceeding to tag...');
}

// 3. Set branch to main
run('git branch -M main');

// 4. Create git tag automatically
try {
    run(`git tag ${tagVersion}`);
    console.log(`\x1b[32m✓ Created Git Tag: ${tagVersion}\x1b[0m`);
} catch (e) {
    console.log(`Tag ${tagVersion} already exists or failed to create.`);
}

// 5. Push code and tag to GitHub
console.log(`\n\x1b[35m📤 Pushing to https://github.com/sabbir28/DesiFlix.git ...\x1b[0m`);
run('git push -u origin main');
run(`git push origin ${tagVersion}`);

console.log(`\n\x1b[32m🎉 RELEASE COMPLETE!\x1b[0m`);
console.log(`\x1b[33mGitHub Actions is now automatically building & publishing your Android APK release at:\x1b[0m`);
console.log(`👉 https://github.com/sabbir28/DesiFlix/releases/tag/${tagVersion}\n`);
