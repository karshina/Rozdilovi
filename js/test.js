QUnit.test("suggest with one word match", function(assert) {
  var result = rozd.suggest({video: "35241509", words: ["нічого", "любові", "ніжності", "ночами", "нічого"]}, ["ночами"]);
  assert.deepEqual(result.suggestedWords, ["нічого", "любові", "ніжності", "нічого"]);
  assert.strictEqual(result.combo, null)
});

QUnit.test("suggest with two words match", function(assert) {
  var result = rozd.suggest({video: "35241509", words: ["нічого", "любові", "ніжності", "ночами", "нічого"]}, ["ночами", "любові"]);
  assert.deepEqual(result.suggestedWords, ["нічого", "ніжності", "нічого"]);
  assert.strictEqual(result.combo, null)
});

QUnit.test("suggest with all words match", function(assert) {
  var result = rozd.suggest({video: "35241509", words: ["нічого", "любові", "ніжності", "ночами", "нічого"]}, ["нічого", "любові", "ніжності", "ночами", "нічого"]);
  assert.deepEqual(result.suggestedWords, []);
  assert.strictEqual(result.combo, "35241509")
});

QUnit.test("suggest with non-match word", function(assert) {
  var result = rozd.suggest({video: "35241509", words: ["нічого", "любові", "ніжності", "ночами", "нічого"]}, ["абрікосик1"]);
  assert.deepEqual(result.suggestedWords, []);
  assert.strictEqual(result.combo, null)
});

QUnit.test("empty circle", function(assert) {
  var result = rozd.getState([]);
  assert.deepEqual(result.suggestedWords, rozd.mainWords);
  assert.strictEqual(result.combo, null);
});

QUnit.test("circle with first word", function(assert) {
  var result = rozd.getState(["ночами"]);
  // TODO: ask DimaL - do we REALLY need to suggest same word twice?
  // it really overcomplicates the algorithm and does not give a lot of sense for the UI
  // assert.deepEqual(result.suggestedWords, ["нічого", "любові", "ніжності", "нічого"]);
  assert.deepEqual(result.suggestedWords, ["нічого", "любові", "ніжності"]);
  assert.strictEqual(result.combo, null);
});

QUnit.test("circle multiple combos with one word", function(assert) {
  var result = rozd.getState(["ніжність"]);
  assert.deepEqual(result.suggestedWords, ["любов", "вночі", "нічні"]);
  assert.strictEqual(result.combo, null);
});

QUnit.test("test combo", function(assert) {
  var result = rozd.getState(["нічого", "любові", "ніжності", "ночами", "нічого"]);
  assert.deepEqual(result.suggestedWords, []);
  assert.strictEqual(result.combo, "35241509");
});

QUnit.test("test nichogo", function(assert) {
  var result = rozd.getState(["нічого"]);
  assert.deepEqual(result.suggestedWords, ["ніч", "нічне", "ніжності", "любові", "ночами", "нічого", "ночі", "ніжно"]);
  assert.strictEqual(result.combo, "46666312");
});
