import {spawn} from 'node:child_process';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','--host','127.0.0.1','--port','4178','--strictPort'],{stdio:'pipe'});
let browser;
try{
 for(let i=0;i<60;i++){try{if((await fetch('http://127.0.0.1:4178')).ok)break;}catch{}await new Promise(r=>setTimeout(r,250));}
 await mkdir('test-results',{recursive:true});
 browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1500,height:1150},deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4178/?t=8');await page.waitForSelector('canvas');await page.waitForTimeout(500);
 assert.equal(await page.locator('html').getAttribute('data-renderer'),'webgl');
 await page.screenshot({path:'test-results/desktop.png',fullPage:true});
 await page.locator('[data-index="3"]').click();assert.equal(await page.locator('#agent-name').textContent(),'VAULT');
 await page.locator('#scenario').selectOption('surge');assert.equal(await page.locator('#rate').textContent(),'24');
 await page.locator('#pause').click();await page.waitForTimeout(350);await page.locator('#pause').click();
 const t=await page.locator('html').getAttribute('data-time');assert.ok(Number(t)>8);await page.waitForTimeout(200);assert.equal(await page.locator('html').getAttribute('data-time'),t);
 await page.locator('#reset').click();assert.equal(await page.locator('html').getAttribute('data-time'),'0.000');
 await page.locator('#capture').click();assert.ok(page.url().includes('t=0.000'));
 await page.setViewportSize({width:390,height:844});await page.goto('http://127.0.0.1:4178/?t=8');await page.waitForTimeout(300);
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:'test-results/portrait.png',fullPage:true});
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('http://127.0.0.1:4178/');await page.waitForTimeout(200);assert.equal(await page.locator('html').getAttribute('data-time'),'8.000');
 await page.goto('http://127.0.0.1:4178/?fallback=1&t=8');assert.equal(await page.locator('html').getAttribute('data-renderer'),'svg');await page.screenshot({path:'test-results/fallback.png',fullPage:true});
 assert.deepEqual(errors,[]);console.log('PASS: WebGL, desktop, portrait overflow, selection, scenario, pause/resume, reset, freeze, reduced motion, SVG fallback, no page errors.');
}finally{await browser?.close();server.kill();}
