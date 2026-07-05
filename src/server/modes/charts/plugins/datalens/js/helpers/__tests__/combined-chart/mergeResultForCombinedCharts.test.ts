import {
    combineLayersIntoSingleChart,
    extendCombinedChartGraphs,
    mergeResultForCombinedCharts,
} from '../../layer-chart';

describe('combineLayersIntoSingleChart', () => {
    it('keeps Y and Y2 series bound to their axes when Y is added after Y2', () => {
        const result = combineLayersIntoSingleChart({
            layers: [
                {
                    yAxis: [{position: 'right'}],
                    series: {data: [{name: 'Y2', type: 'line', yAxis: 0, data: []}]},
                },
                {
                    yAxis: [{position: 'left'}],
                    series: {data: [{name: 'Y', type: 'line', yAxis: 0, data: []}]},
                },
            ],
        });

        expect(result?.yAxis).toEqual([{position: 'left'}, {position: 'right'}]);
        expect(result?.series?.data).toEqual([
            expect.objectContaining({name: 'Y2', yAxis: 1}),
            expect.objectContaining({name: 'Y', yAxis: 0}),
        ]);
    });
});

describe('extendCombinedChartGraphs', () => {
    it('keeps Y2-only series on the only available axis when no layer has Y', () => {
        const graphs = [{title: 'Sales', yAxis: 0}];
        const emptyY = {id: 'y', items: []};
        const y2 = {id: 'y2', items: [{guid: 'sales'}]};
        const layer = {
            id: 'line',
            layerSettings: {id: 'y2-layer'},
            placeholders: [{id: 'x', items: []}, emptyY, y2],
        };

        extendCombinedChartGraphs({
            graphs,
            layer,
            layers: [
                layer,
                {
                    id: 'line',
                    layerSettings: {id: 'empty-layer'},
                    placeholders: [{id: 'x', items: []}, emptyY, {id: 'y2', items: []}],
                },
            ],
            legendValues: {},
        } as Parameters<typeof extendCombinedChartGraphs>[0]);

        expect(graphs[0].yAxis).toBe(0);
    });

    it('moves Y2-only series to secondary axis when another layer has Y', () => {
        const graphs = [{title: 'Sales', yAxis: 0}];
        const layer = {
            id: 'line',
            layerSettings: {id: 'y2-layer'},
            placeholders: [
                {id: 'x', items: []},
                {id: 'y', items: []},
                {id: 'y2', items: [{guid: 'sales'}]},
            ],
        };

        extendCombinedChartGraphs({
            graphs,
            layer,
            layers: [
                {
                    id: 'line',
                    layerSettings: {id: 'y-layer'},
                    placeholders: [
                        {id: 'x', items: []},
                        {id: 'y', items: [{guid: 'profit'}]},
                        {id: 'y2', items: []},
                    ],
                },
                layer,
            ],
            legendValues: {},
        } as Parameters<typeof extendCombinedChartGraphs>[0]);

        expect(graphs[0].yAxis).toBe(1);
    });
});

describe('mergeResultForCombinedCharts', () => {
    it('Should merge all results into one graphs array', () => {
        const mockedResults = [
            {graphs: [{name: 'Test', data: [1, 2, 3, 4]}]},
            {graphs: [{name: 'Test 2', data: [{x: 1, y: 5}]}]},
        ];

        const result = mergeResultForCombinedCharts(mockedResults);

        expect(result).toEqual({
            graphs: [
                {name: 'Test', data: [1, 2, 3, 4]},
                {name: 'Test 2', data: [{x: 1, y: 5}]},
            ],
        });
    });

    it('Should remove empty graph', () => {
        const mockedResults = [
            {graphs: [{name: 'Test', data: [1, 2, 3, 4]}]},
            {graphs: [{name: 'Test 2', data: [{x: 1, y: 5}]}]},
            {graphs: [{name: 'Test 3', data: [null, null, null]}]},
            {graphs: [{name: 'Test 4', data: []}]},
        ];

        const result = mergeResultForCombinedCharts(mockedResults);

        expect(result).toEqual({
            graphs: [
                {name: 'Test', data: [1, 2, 3, 4]},
                {name: 'Test 2', data: [{x: 1, y: 5}]},
            ],
        });
    });

    it('Should return first empty chart when all graphs without data', () => {
        const mockedResults = [
            {graphs: [{name: 'Test 1', data: [null, null, null]}]},
            {graphs: [{name: 'Test 2', data: [null, null, null]}]},
            {graphs: [{name: 'Test 3', data: [null, null, null]}]},
            {graphs: [{name: 'Test 4', data: []}]},
        ];

        const result = mergeResultForCombinedCharts(mockedResults);

        expect(result).toEqual({
            graphs: [{name: 'Test 1', data: [null, null, null]}],
        });
    });

    it('Should remove categories_ms when one chart with data exists', () => {
        const mockedResults = [
            {
                graphs: [{name: 'Test 1', data: [null, null, null]}],
                categories_ms: [12321421, 124242151],
            },
            {graphs: [{name: 'Test 2', data: [1, 2, 3, 4]}]},
        ];

        const result = mergeResultForCombinedCharts(mockedResults);

        expect(result).toEqual({graphs: [{name: 'Test 2', data: [1, 2, 3, 4]}]});
    });
});
