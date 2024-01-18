import { test, expect } from '@playwright/test';

// const root = "https://explorer-mvmt-m2.web.app/?network=devnet"
const root = "http://127.0.0.1:3000/"
const pageTitle = "M2 Sui Explorer"

function health_log({
  health_check,
  status,
  group = "movement-faucet",
  reason
} : {
  health_check : string,
  status : "PASS" | "FAIL",
  group ? : string,
  reason : string
}){

  console.log(
    `health_check="${health_check}" status="${status}" group="${group}" reason="${reason}""`
  )

}

test('exists', async ({ page }) => {
  const successful = await page.goto(root);
  health_log({
    health_check: "exists",
    status: successful ? "PASS" : "FAIL",
    reason: "page exists"
  })
  await expect(page).toHaveTitle(/M2 Sui Explorer/);
});

test('has title', async ({ page }) => {
  await page.goto(root);

  const title = await page.title();
  health_log({
    health_check: "has-title",
    status: title === pageTitle ? "PASS" : "FAIL",
    reason: "title is present"
  })

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/M2 Sui Explorer/);

});

test('pauses', async ({ page }) => {
  await page.goto(root);

  // Click the get started link.
  await page.getByRole('button', {name: "Playing"}).click();
  const res = await page.waitForSelector('text=Auto-refresh paused', {
    timeout : 1000
  });

  await page.getByRole('button', {name: "Paused"}).click();
  const res2 = await page.waitForSelector('text=Auto-refreshing on - every 10 seconds', {
    timeout : 1000
  });

  health_log({
    health_check: "pauses-auto-refresh",
    status: res && res2 ? "PASS" : "FAIL",
    reason: "get started link is present"
  })

  // Expects page to have a heading with the name of Installation.
  await expect(res).toBeDefined();

});

// test('opens checkpoint', async ({ page }) => {
//   await page.goto(root);

//   // Click the get checkpoints link.
//   await page.getByRole('button', {name: "checkpoints"}).click();
//   const res = await page.waitForSelector('text=TRANSACTION BLOCK COUNT', {
//     timeout : 1000
//   });

//   health_log({
//     health_check: "opens-checkpoints",
//     status: res ? "PASS" : "FAIL",
//     reason: "can open checkpoints"
//   })

//   // Expects page to have a heading with the name of Installation.
//   await expect(res).toBeDefined();

// });