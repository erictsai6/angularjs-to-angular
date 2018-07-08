import test from 'ava';
import imports from '../src/lib/services/service-imports';
const path = require('path');
const getAst = require('./utils/get-ast');
const file = path.join(process.cwd(), 'tests/data/reddit.service.ts');

test('#get', t => {
	const ast = getAst(file);
	const result = imports.get(ast);
    const expected = `import { Credentials } from '../models/credentials.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Identity } from '../models/identity.model';
import { Injectable, Inject } from '@angular/core';
import { OauthService } from './oauth.service';
import { SearchQuery } from '../models/search-query.model';
import { StorageUtility, StorageKeys } from "../utilities/storage.utility";`;
	t.deepEqual(result, expected);
});