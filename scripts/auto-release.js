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

// 1. Read current package.json version
const pkgPath = path.resolve('package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

const args = process.argv.slice(2);
const isNoBump = args.includes('--no-bump');
const bumpType = args.find(a => a.startsWith('--bump='))?.split('=')[1] || 'patch';

let currentVersion = pkg.version || '1.0.0';
let newVersion = currentVersion;

if (!isNoBump) {
    const parts = currentVersion.split('.').map(n => parseInt(n, 10) || 0);
    while (parts.length < 3) parts.push(0);

    if (bumpType === 'major') {
        parts[0] += 1;
        parts[1] = 0;
        parts[2] = 0;
    } else if (bumpType === 'minor') {
        parts[1] += 1;
        parts[2] = 0;
    } else {
        // default patch bump
        parts[2] += 1;
    }
    newVersion = parts.join('.');

    console.log(`\n\x1b[33m📈 Auto-incrementing version: ${currentVersion} ➔ ${newVersion}\x1b[0m`);

    // Update package.json
    pkg.version = newVersion;
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
    console.log(`\x1b[32m✓ Updated package.json version to ${newVersion}\x1b[0m`);

    // Update android/app/build.gradle if present
    const gradlePath = path.resolve('android', 'app', 'build.gradle');
    if (fs.existsSync(gradlePath)) {
        let gradleContent = fs.readFileSync(gradlePath, 'utf8');

        // Increment versionCode
        gradleContent = gradleContent.replace(/versionCode\s+(\d+)/, (match, code) => {
            const newCode = parseInt(code, 10) + 1;
            return `versionCode ${newCode}`;
        });

        // Update versionName
        gradleContent = gradleContent.replace(/versionName\s+"[^"]+"/, `versionName "${newVersion}"`);

        fs.writeFileSync(gradlePath, gradleContent);
        console.log(`\x1b[32m✓ Updated android/app/build.gradle (versionCode & versionName "${newVersion}")\x1b[0m`);
    }
}

const tagVersion = `v${newVersion}`;
console.log(`\n\x1b[32m🚀 Starting Auto-Release for DesiFlix Version ${tagVersion}\x1b[0m\n`);

// Stage updated version files & changes
run('git add package.json package-lock.json android/app/build.gradle');
run('git add .');

// Commit changes
try {
    run(`git commit -m "release: ${tagVersion} - DesiFlix Android APK release (Signed)"`);
} catch (e) {
    console.log('No new changes to commit, proceeding to tag...');
}

// Ensure main branch
run('git branch -M main');

// Create git tag
try {
    run(`git tag ${tagVersion}`);
    console.log(`\x1b[32m✓ Created Git Tag: ${tagVersion}\x1b[0m`);
} catch (e) {
    console.log(`Tag ${tagVersion} already exists or failed to create.`);
}

// Push code and tag to GitHub
console.log(`\n\x1b[35m📤 Pushing to GitHub (main & tag ${tagVersion})...\x1b[0m`);
run('git push -u origin main');
run(`git push origin ${tagVersion}`);

console.log(`\n\x1b[32m🎉 RELEASE COMPLETE!\x1b[0m`);
console.log(`\x1b[33mGitHub Actions is now automatically building & publishing your SIGNED Android APK release at:\x1b[0m`);
console.log(`👉 https://github.com/sabbir28/DesiFlix/releases/tag/${tagVersion}\n`);


