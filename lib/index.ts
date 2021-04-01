export function arrayEqual( a: Array< string >, b: Array< string > ): boolean
{
	if ( a.length !== b.length )
		return false;
	else if ( a.length === 0 )
		return true;
	return !a.some( ( nodeA, i ) => nodeA !== b[ i ] );
}

export function rotatedArrayEqual( a: Array< string >, b: Array< string > )
: boolean
{
	if ( a.length !== b.length )
		return false;
	else if ( !a.length )
		return true;

	const offset = b.indexOf( a[ 0 ] );
	if ( offset === -1 )
		return false;

	const _b =
		offset === 0
		? b
		: [ ...b.slice( offset ), ...b.slice( 0, offset ) ];
	return arrayEqual( a, _b );
}

interface Node< T >
{
	keys: Array< string >;
	hash: number;
	value: Array< T >;
}

type HashCache = Map< string, number >;

function simpleHash( text: string, hashCache: HashCache ): number
{
	const textLength = text.length;
	if ( textLength === 0 )
		return 4711;

	const quads: Array< number > = [ ];
	for ( let i = 0; i < textLength; ++i )
	{
		let byte = text.charCodeAt( i ) + i * 13;
		byte = byte % 256;
		const mod = i % 4;
		if ( mod === 0 )
			quads.push( byte );
		else
			quads[ quads.length - 1 ] |=
				byte << ( mod === 1 ? 8 : mod === 2 ? 16 : 24 );
	}

	const hash = quads.reduce( ( prev, cur ) => prev ^ cur, textLength * 13 );

	hashCache.set( text, hash );

	return hash;
}

function nodeHash( keys: Array< string >, hashCache: HashCache ): number
{
	if ( keys.length === 0 )
		return 31415;

	return keys
		.map( key => hashCache.get( key ) ?? simpleHash( key, hashCache ) )
		.reduce( ( prev, cur ) => prev ^ cur, keys.length * 13 );
}

export type Stringify< T > = ( t: T ) => string;

export class RotatedArraySet< T >
{
	private hashCache: HashCache = new Map( );
	public tree = new Map< number, Set< Node< T > > >( );

	constructor( private stringify: Stringify< T > = ( t: T ) => `${t}` )
	{ }

	private makeNode( arr: Array< T > ): Node< T >
	{
		const keys = arr.map( t => this.stringify( t ) );
		const hash = nodeHash( keys, this.hashCache );
		const node: Node< T > = {
			keys,
			hash,
			value: arr,
		};
		return node;
	}

	add( arr: Array< T > )
	{
		const node = this.makeNode( arr );

		if ( this._has( node ) )
			return false;

		let set = this.tree.get( node.hash );
		if ( !set )
		{
			set = new Set( );
			this.tree.set( node.hash, set );
		}
		set.add( node );

		return true;
	}

	private _has( node: Node< T > ): Node< T > | undefined
	{
		const set = this.tree.get( node.hash );

		if ( !set )
			return undefined;

		for ( const iter of set.values( ) )
			if ( rotatedArrayEqual( iter.keys, node.keys ) )
				return iter;

		/* istanbul ignore next */
		return undefined;
	}

	has( arr: Array< T > ): boolean
	{
		return !!this._has( this.makeNode( arr ) );
	}

	delete( arr: Array< T > )
	{
		const node = this._has( this.makeNode( arr ) );

		if ( !node )
			return false;

		const set = this.tree.get( node.hash );
		set!.delete( node );

		if ( set!.size === 0 )
			this.tree.delete( node.hash );

		return true;
	}

	values( ): Array< Array< T > >
	{
		const set = new Set< Node< T > >(
			[ ...this.tree.values( ) ].flatMap( set => [ ...set.values( ) ] )
		);

		return [ ...set ].map( ( { value } ) => value );
	}
}
