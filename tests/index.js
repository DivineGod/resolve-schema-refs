var test = require('tape'),
    resolve = require('../'),
    testDefinitions = {
        foo: {
            things: 'stuff'
        },
        beep: {
            type: 'object',
            properties: {
                boop: 'majigger',
                $ref: 'test:wat'
            }
        },
        wat: {
            waca:'waca'
        },
        bar:{
            type: 'object',
            properties: {
                data: {
                    // type: 'object',
                    anyOf: [
                        { $ref: 'test:foo' },
                        { $ref: 'test:beep' }
                    ]
                }
            }
        },
        thingy: {
            type: 'array',
            items: {$ref: 'test:wat'}
        },
        zoop: {
            type: 'string',
        }
    };

test('works as root', function(t){
    t.plan(1);

    var result = resolve(
            {
                $ref: 'test:foo'
            },
            testDefinitions
        );

    t.deepEqual(result, testDefinitions.foo, 'works as root');
});

test('works with objects', function(t){
    t.plan(1);

    var result = resolve(
            {
                type: 'object',
                properties: {
                    bar: 'majigger',
                    $ref: 'test:foo',
                    zoop: {
                        $ref: 'test:zoop'
                    }
                }
            },
            testDefinitions
        );

    t.deepEqual(
        result,
        {
            type: 'object',
            properties: {
                bar: 'majigger',
                foo: testDefinitions.foo,
                zoop: testDefinitions.zoop
            }
        },
        'works with objects'
    );
});

test('works with arrays', function(t){
    t.plan(1);

    var result = resolve(
            {
                type: 'array',
                items: [
                    {$ref: 'test:foo'}
                ]
            },
            testDefinitions
        );

    t.deepEqual(
        result,
        {
            type: 'array',
            items: [
                testDefinitions.foo
            ]
        },
        'works with objects'
    );
});

test('works with multiple nestings', function(t){
    t.plan(1);

    var result = resolve(
            {
                $ref: 'test:bar'
            },
            testDefinitions
        );

    t.deepEqual(
        result,
        {
            type: 'object',
            properties: {
                data: {
                    anyOf: [
                        testDefinitions.foo,
                        {
                            type: 'object',
                            properties: {
                                boop: 'majigger',
                                wat: testDefinitions.wat
                            }
                        }
                    ]
                }
            }
        },
        'works with multiple nestings'
    );
});

test('works with arrays with reference as items', function(t){
    t.plan(1);

    var result = resolve(
            {
                $ref: 'test:thingy'
            },
            testDefinitions
        );

    t.deepEqual(
        result,
        {
            type: 'array',
            items: testDefinitions.wat
        },
        'works with arrays with reference as items'
    );
});
