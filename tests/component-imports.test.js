import test from 'ava';
import imports from '../src/lib/components/component-imports';
const path = require('path');
const getAst = require('./utils/get-ast');
const file = path.join(process.cwd(), 'tests/data/account.component.ts');

test('#get', t => {
	const ast = getAst(file);
	const result = imports.get(ast);
	const expected = `import { Component, OnInit } from \'@angular/core\';
import { Credentials } from '../../shared/models/credentials.model';
import { Identity } from '../../shared/models/identity.model';
import { Location } from \'@angular/common\';
import { OauthService } from '../../shared/services/oauth.service';
import { RedditService } from '../../shared/services/reddit.service';`;
	t.deepEqual(result, expected);
});