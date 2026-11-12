// Browser smoke test for the GitHub Pages base path. Chrome is provided by the Actions runner.
const { chromium } = require('playwright-core');
const {spawn} = require('node:child_process');
const {mkdtempSync,cpSync,mkdirSync,rmSync} = require('node:fs');
const {tmpdir}=require('node:os');
const {join}=require('node:path');
const assert=require('node:assert/strict');
(async()=>{
 const root=mkdtempSync(join(tmpdir(),'veil-browser-'));mkdirSync(join(root,'ai-website-cloner-template'));cpSync('out',join(root,'ai-website-cloner-template'),{recursive:true});
 const server=spawn(process.execPath,['server/party.mjs'],{env:{...process.env,SITE_DIR:root,PORT:'3199'},stdio:['ignore','pipe','pipe']});let browser;
 try{
  await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('Server startup timed out')),10000);server.once('error',reject);server.once('exit',code=>reject(new Error(`Server exited ${code}`)));server.stdout.on('data',d=>{if(d.toString().includes('listening')){clearTimeout(timer);resolve();}});});
  browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const errors=[];const page=await browser.newPage({viewport:{width:1365,height:900}});page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:3199/ai-website-cloner-template/veil/',{waitUntil:'networkidle'});await page.locator('canvas').waitFor();assert.equal(await page.getByText('无法启动 3D 画面').count(),0);
  await page.getByRole('button',{name:'开始旅程'}).click();await page.keyboard.press('e');await page.getByText('织时 · 敌人的动作被减缓').waitFor();await page.keyboard.down('w');await page.waitForTimeout(800);await page.keyboard.up('w');await page.getByRole('button',{name:'暂停',exact:true}).click();await page.getByText('旅途暂停').waitFor();await page.getByRole('button',{name:'继续旅程'}).click();assert.equal(await page.getByText('旅途暂停').count(),0);
  const mobile=await browser.newPage({viewport:{width:390,height:844},hasTouch:true,isMobile:true});mobile.on('pageerror',e=>errors.push(e.message));await mobile.goto('http://127.0.0.1:3199/ai-website-cloner-template/veil/',{waitUntil:'networkidle'});await mobile.locator('canvas').waitFor();await mobile.getByRole('button',{name:'开始旅程'}).click();assert.equal(await mobile.getByRole('button',{name:'前进'}).isVisible(),true);await mobile.getByRole('button',{name:'织时'}).click();await mobile.getByText('织时 · 敌人的动作被减缓').waitFor();assert.deepEqual(errors,[]);console.log('Desktop and mobile browser smoke tests passed; WebGL canvas initialized.');
 }finally{if(browser)await browser.close();server.kill('SIGTERM');rmSync(root,{recursive:true,force:true});}
})().catch(e=>{console.error(e);process.exitCode=1;});
